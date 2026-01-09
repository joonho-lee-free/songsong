import { NextResponse } from "next/server";
import CoolSMS from "coolsms-node-sdk";
import admin from "firebase-admin";
import crypto from "crypto";

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

/** ✅ 최근 문의현황용: 마지막 4자리만 */
function phoneLast4(phone: string) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length >= 4) return digits.slice(-4);
  return "****";
}

/** ✅ 최근 문의현황/문자 알림용: 마지막 4자리만 노출 */
function maskPhone(phone: string) {
  const last4 = phoneLast4(phone);
  return `010-****-${last4}`;
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
 * ✅ 4) “문자로 접수하기” 더블클릭/재시도 방지 (딱 1회만 접수)
 * - 동일 (상호 + 휴대폰) 조합이 짧은 시간(3분) 안에 다시 들어오면 중복으로 간주
 * ⚠️ Firestore가 죽어있으면(ENV/권한) 중복 방지 불가 → 기존처럼 진행(로직 유지)
 */
function makeDedupKey(phoneDigits: string, storeName: string) {
  const base = `${phoneDigits}|${(storeName || "").trim().toLowerCase()}`;
  return crypto.createHash("sha256").update(base).digest("hex");
}

async function tryAcquireDedupLock(params: {
  db: FirebaseFirestore.Firestore;
  phoneDigits: string;
  storeName: string;
  windowMs: number;
}): Promise<"acquired" | "duplicate"> {
  const { db, phoneDigits, storeName, windowMs } = params;

  const key = makeDedupKey(phoneDigits, storeName);
  const ref = db.collection("public_lead_dedup").doc(key);
  const nowMs = Date.now();

  return await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) {
      const data: any = snap.data() || {};
      const ts = data?.createdAt;
      const createdMs =
        typeof ts?.toMillis === "function"
          ? ts.toMillis()
          : typeof data?.createdAtMs === "number"
          ? data.createdAtMs
          : 0;

      if (createdMs && nowMs - createdMs < windowMs) {
        return "duplicate" as const;
      }
    }

    tx.set(
      ref,
      {
        phoneDigits,
        storeName: (storeName || "").trim(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAtMs: nowMs, // fallback
      },
      { merge: true }
    );

    return "acquired" as const;
  });
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

    const norm = (s: string) => s.replace(/[^0-9]/g, "");
    const phoneDigits = norm(phone);

    // ✅ 4) 딱 1회만 접수(더블클릭/재시도 중복 방지)
    try {
      const db = getAdminDb();
      const lock = await tryAcquireDedupLock({
        db,
        phoneDigits,
        storeName,
        windowMs: 3 * 60 * 1000, // 3분
      });
      if (lock === "duplicate") {
        return redirect303(req.url, "/sms/sent?dup=1");
      }
    } catch (dedupErr: any) {
      console.error("⚠️ DEDUP SKIPPED:", dedupErr?.message || dedupErr);
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
    const from =
      process.env.SOLAPI_FROM?.trim() || process.env.COOLSMS_FROM?.trim();

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

    const fromN = norm(from);
    const toN = norm(to);

    if (fromN.length < 10 || toN.length < 10) {
      console.error("❌ Phone format invalid", { from, to });
      return redirect303(req.url, "/?error=bad_phone_env#sms-lead");
    }

    const sms = new (CoolSMS as any)(apiKey, apiSecret);

    /**
     * ✅ 1) 첫 행 강조(볼드 대체)  2) 연락처 마지막 4자리  3) 지역 표기
     * - SMS는 진짜 Bold 불가 → “【 】” 헤더로 한 줄 강조
     */
    const text =
      `【이가에프엔비 문자문의】\n` +
      `상호: ${storeName}\n` +
      `연락처: ${maskPhone(phone)}\n` +
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

      const hasRealMessage = (message || "").trim().length > 0;
      const regionAuto = hasRealMessage ? detectRegion(message) : "미지정";
      const inquiryTypeAuto = hasRealMessage ? detectInquiryType(message) : "미지정";

      const finalRegion =
        regionSafe !== "미지정"
          ? regionSafe
          : regionAuto === "미정"
          ? "미지정"
          : regionAuto;

      const finalInquiryType =
        inquiryTypeSafe !== "미지정" ? inquiryTypeSafe : inquiryTypeAuto;

      const displayName = maskStoreNamePublic(storeName);
      const displayPhone = maskPhone(phone); // ✅ 마지막 4자리만
      const displayRegion = finalRegion;

      const createdAt = admin.firestore.FieldValue.serverTimestamp();

      await db.collection("public_secure_leads").add({
        storeName,
        phone,
        phoneLast4: phoneLast4(phone),
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
        storeName: displayName,
        phone: displayPhone,
        phoneLast4: phoneLast4(phone),
        region: displayRegion,
        inquiryType: finalInquiryType,
        message: messageSafe,
        source: (source || "").trim() || "sms",
        createdAt,

        displayName,
        displayPhone,
        displayRegion,
      });

      console.log(
        "✅ FIRESTORE SAVED (dual-write): public_secure_leads + public_leads"
      );
    } catch (firebaseErr: any) {
      console.error("❌ FIRESTORE FAILED:", firebaseErr?.message || firebaseErr);
    }

    return redirect303(req.url, "/sms/sent");
  } catch (err: any) {
    console.error("[sms-lead] error:", err);
    return redirect303(req.url, `/?error=${shortErr(err)}#sms-lead`);
  }
}
