import { NextResponse } from "next/server";
import CoolSMS from "coolsms-node-sdk";
import admin from "firebase-admin";

export const runtime = "nodejs";

function redirect303(reqUrl: string, pathWithHash: string) {
  return NextResponse.redirect(new URL(pathWithHash, reqUrl), { status: 303 });
}

function shortErr(err: any) {
  const name = err?.name || "Error";
  const msg = err?.message || "unknown";
  return encodeURIComponent(`${name}:${String(msg).slice(0, 120)}`);
}

function detectInquiryType(message: string) {
  const m = (message || "").toLowerCase();
  if (/(애견|강아지|반려견|간식|펫)/.test(m)) return "애견간식 문의";
  if (/(도매|납품|물량|대량|정기|거래처)/.test(m)) return "도매 납품 문의";
  if (/(단가|가격|견적|원가|박스|몇\s*박스)/.test(m)) return "단가/견적 문의";
  if (/(배송|택배|퀵|냉동|지역)/.test(m)) return "배송/지역 문의";
  return "기타 문의";
}

function detectRegion(message: string) {
  const m = (message || "").toLowerCase();
  const regions: Array<[RegExp, string]> = [
    [/제주/, "제주"],
    [/서울/, "서울"],
    [/경기|수원|성남|용인|화성|평택|고양|부천/, "경기"],
    [/인천/, "인천"],
    [/부산/, "부산"],
    [/대구/, "대구"],
    [/울산/, "울산"],
    [/대전/, "대전"],
    [/광주/, "광주"],
    [/세종/, "세종"],
    [/강원/, "강원"],
    [/충북|청주/, "충북"],
    [/충남|천안|아산/, "충남"],
    [/전북|전주/, "전북"],
    [/전남|여수|순천|목포/, "전남"],
    [/경북|포항|구미|경주/, "경북"],
    [/경남|창원|김해|양산|진주/, "경남"],
  ];
  for (const [re, label] of regions) if (re.test(m)) return label;
  return "미정";
}

function maskStoreNamePublic(storeName: string) {
  const s = (storeName || "").trim();
  if (!s) return "익명***";
  if (s.length === 1) return `${s}***`;
  return `${s.slice(0, 2)}***`;
}

function maskPhone(phone: string) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-***-${digits.slice(6)}`;
  return "010-****-****";
}

function getAdminDb() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("FIREBASE_ADMIN_ENV_MISSING");
    }

    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  }
  return admin.firestore();
}

/**
 * ✅ JSON / form-urlencoded / multipart 모두 지원
 * + CTA/Hero 필드명 차이를 흡수하도록 키 후보 여러 개 받음
 */
async function readBody(req: Request): Promise<{
  storeName: string;
  phone: string;
  region: string;
  inquiryType: string;
  message: string;
  source: string;
}> {
  const ct = (req.headers.get("content-type") || "").toLowerCase();

  const pick = (obj: any, keys: string[]) => {
    for (const k of keys) {
      const v = obj?.[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
  };

  if (ct.includes("application/json")) {
    const data: any = await req.json();
    return {
      storeName: pick(data, ["storeName", "name", "customerName", "fullName"]),
      phone: pick(data, ["phone", "tel", "contact", "mobile"]),
      region: pick(data, ["region", "area", "location"]),
      inquiryType: pick(data, ["inquiryType", "inquiry", "type", "category"]),
      message: pick(data, ["message", "content", "memo", "detail"]),
      source: pick(data, ["source", "from", "utm_source", "event_label"]),
    };
  }

  const fd = await req.formData();
  const pickFd = (keys: string[]) => {
    for (const k of keys) {
      const v = fd.get(k);
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
  };

  return {
    storeName: pickFd(["storeName", "name", "customerName", "fullName"]),
    phone: pickFd(["phone", "tel", "contact", "mobile"]),
    region: pickFd(["region", "area", "location"]),
    inquiryType: pickFd(["inquiryType", "inquiry", "type", "category"]),
    message: pickFd(["message", "content", "memo", "detail"]),
    source: pickFd(["source", "from", "utm_source", "event_label"]),
  };
}

export async function POST(req: Request) {
  try {
    const { storeName, phone, region, inquiryType, message, source } =
      await readBody(req);

    /**
     * ✅ 필수값 정책 변경
     * - 상호(가게명), 연락처만 필수
     * - 나머지(지역/문의/요청내용)는 비어도 저장 가능
     */
    if (!storeName || !phone) {
      return redirect303(req.url, "/?error=invalid_input#sms-lead");
    }

    // ✅ 빈칸이면 “미지정”으로 처리
    const messageSafe = (message || "").trim() || "미지정";
    const regionSafe = (region || "").trim() || "미지정";
    const inquiryTypeSafe = (inquiryType || "").trim() || "미지정";

    /** ✅ SOLAPI 우선 / 없으면 COOLSMS fallback */
    const apiKey =
      process.env.SOLAPI_API_KEY?.trim() || process.env.COOLSMS_API_KEY?.trim();
    const apiSecret =
      process.env.SOLAPI_API_SECRET?.trim() ||
      process.env.COOLSMS_API_SECRET?.trim();
    const from = process.env.SOLAPI_FROM?.trim() || process.env.COOLSMS_FROM?.trim();

    // ⚠️ 기존 로직 유지: 관리자(너)에게 문자 알림 보내는 구조면 TO는 환경변수로 받음
    const to = process.env.SOLAPI_TO?.trim() || process.env.COOLSMS_TO?.trim();

    if (!apiKey || !apiSecret || !from || !to) {
      console.error("❌ ENV missing", {
        SOLAPI_API_KEY: !!process.env.SOLAPI_API_KEY,
        SOLAPI_API_SECRET: !!process.env.SOLAPI_API_SECRET,
        SOLAPI_FROM: !!process.env.SOLAPI_FROM,
        SOLAPI_TO: !!process.env.SOLAPI_TO,
        COOLSMS_API_KEY: !!process.env.COOLSMS_API_KEY,
        COOLSMS_API_SECRET: !!process.env.COOLSMS_API_SECRET,
        COOLSMS_FROM: !!process.env.COOLSMS_FROM,
        COOLSMS_TO: !!process.env.COOLSMS_TO,
      });
      return redirect303(req.url, "/?error=server_env#sms-lead");
    }

    const norm = (s: string) => s.replace(/[^0-9]/g, "");
    const fromN = norm(from);
    const toN = norm(to);

    if (fromN.length < 10 || toN.length < 10) {
      console.error("❌ Phone format invalid", { from, to });
      return redirect303(req.url, "/?error=bad_phone_env#sms-lead");
    }

    // ✅ SOLAPI 호출 SDK (패키지명이 coolsms-node-sdk인 게 정상)
    const sms = new (CoolSMS as any)(apiKey, apiSecret);

    const text =
      `[이가에프엔비 문자문의]\n` +
      `상호: ${storeName}\n` +
      `연락처: ${phone}\n` +
      `지역: ${regionSafe}\n` +
      `문의: ${inquiryTypeSafe}\n` +
      `내용: ${messageSafe}\n` +
      (source ? `출처: ${source}\n` : "");

    const result = await sms.sendOne({
      from: fromN,
      to: toN,
      text,
    });

    console.log("✅ SMS SENT result:", result);

    // ✅ Firestore 저장 (기존: dual-write 유지)
    try {
      const db = getAdminDb();

      /**
       * ✅ “어디 한군데만 적어도 저장” 충족
       * - message가 있으면 자동감지로 region/inquiryType 보정 가능
       * - 다 비었으면 이미 “미지정”으로 들어감
       */
      const hasRealMessage = (message || "").trim().length > 0;

      const regionAuto = hasRealMessage ? detectRegion(message) : "미지정";
      const inquiryTypeAuto = hasRealMessage ? detectInquiryType(message) : "미지정";

      // 사용자가 직접 썼으면 그게 우선, 비었으면 자동/미지정
      const finalRegion =
        regionSafe !== "미지정" ? regionSafe : (regionAuto === "미정" ? "미지정" : regionAuto);

      const finalInquiryType =
        inquiryTypeSafe !== "미지정" ? inquiryTypeSafe : inquiryTypeAuto;

      const displayName = maskStoreNamePublic(storeName);
      const displayPhone = maskPhone(phone);
      const displayRegion = finalRegion;

      const createdAt = admin.firestore.FieldValue.serverTimestamp();

      await db.collection("public_secure_leads").add({
        storeName,
        phone,
        message: messageSafe,
        region: finalRegion,
        inquiryType: finalInquiryType,
        source: (source || "").trim() || "sms",
        displayName,
        displayPhone,
        displayRegion,
        createdAt,
      });

      await db.collection("public_leads").add({
        displayName,
        displayPhone,
        displayRegion,
        inquiryType: finalInquiryType,
        createdAt,
      });

      console.log("✅ FIRESTORE SAVED (dual-write): public_secure_leads + public_leads");
    } catch (firebaseErr: any) {
      console.error("❌ FIRESTORE FAILED:", firebaseErr?.message || firebaseErr);
      // SMS는 이미 갔으니 UX는 성공 유지
    }

    return redirect303(req.url, "/sms/sent");
  } catch (err: any) {
    console.error("[sms-lead] error:", err);
    return redirect303(req.url, `/?error=${shortErr(err)}#sms-lead`);
  }
}
