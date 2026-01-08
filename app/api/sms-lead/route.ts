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
  return encodeURIComponent(`${name}:${String(msg).slice(0, 80)}`);
}

function detectInquiryType(message: string) {
  const m = (message || "").toLowerCase();

  if (/(애견|강아지|반려견|간식|펫)/.test(m)) return "애견간식 문의";
  if (/(도매|납품|물량|대량|정기|거래처)/.test(m)) return "도매 납품 문의";
  if (/(단가|가격|견적|원가|박스|몇\s*박스)/.test(m)) return "단가/견적 문의";
  if (/(배송|택배|퀵|냉동|지역)/.test(m)) return "배송/지역 문의";

  return "기타 문의";
}

// ✅ 지역 라벨 감지
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

  for (const [re, label] of regions) {
    if (re.test(m)) return label;
  }
  return "미정";
}

/**
 * ✅ public_leads 저장 규칙:
 * - 앞 2글자 + *** 로 마스킹해서 "저장"
 * - (화면에서 추가 마스킹 금지)
 */
function maskStoreNamePublic(storeName: string) {
  const s = (storeName || "").trim();
  if (!s) return "익명***";
  if (s.length === 1) return `${s}***`;
  return `${s.slice(0, 2)}***`;
}

function maskPhone(phone: string) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 11) {
    const a = digits.slice(0, 3);
    const c = digits.slice(7, 11);
    return `${a}-****-${c}`;
  }
  if (digits.length === 10) {
    const a = digits.slice(0, 3);
    const c = digits.slice(6, 10);
    return `${a}-***-${c}`;
  }
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
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return admin.firestore();
}

/**
 * ✅ JSON / form-urlencoded / multipart 모두 지원
 */
async function readBody(req: Request): Promise<{
  storeName: string;
  phone: string;
  message: string;
}> {
  const ct = (req.headers.get("content-type") || "").toLowerCase();

  // JSON
  if (ct.includes("application/json")) {
    const data: any = await req.json();
    return {
      storeName: String(data?.storeName || data?.name || "").trim(),
      phone: String(data?.phone || "").trim(),
      message: String(data?.message || "").trim(),
    };
  }

  // FormData
  const fd = await req.formData();
  return {
    storeName: String(fd.get("storeName") || "").trim(),
    phone: String(fd.get("phone") || "").trim(),
    message: String(fd.get("message") || "").trim(),
  };
}

export async function POST(req: Request) {
  try {
    const { storeName, phone, message } = await readBody(req);

    if (!storeName || !phone) {
      return redirect303(req.url, "/?error=invalid_input#sms-lead");
    }

    // ✅ 문자 발송 로직 (기존 유지)
    const apiKey = process.env.SOLAPI_API_KEY?.trim();
    const apiSecret = process.env.SOLAPI_API_SECRET?.trim();
    const from = process.env.SOLAPI_FROM?.trim();
    const to = process.env.SOLAPI_TO?.trim();

    if (!apiKey || !apiSecret || !from || !to) {
      console.error("❌ ENV missing", {
        SOLAPI_API_KEY: !!apiKey,
        SOLAPI_API_SECRET: !!apiSecret,
        SOLAPI_FROM: !!from,
        SOLAPI_TO: !!to,
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

    const sms = new (CoolSMS as any)(apiKey, apiSecret);

    const text = `[이가에프엔비 문자문의]
상호: ${storeName}
연락처: ${phone}
내용: ${message || "-"}`;

    const result = await sms.sendOne({
      from: fromN,
      to: toN,
      text,
    });

    console.log("✅ SMS SENT result:", result);

    // ✅ Firestore 저장: dual-write
    // - public_secure_leads: 원문 전체
    // - public_leads: 마스킹(표시용)만
    try {
      const db = getAdminDb();

      const region = detectRegion(message);
      const inquiryType = detectInquiryType(message);

      const displayName = maskStoreNamePublic(storeName); // ✅ 2글자 + ***
      const displayPhone = maskPhone(phone);
      const displayRegion = region;

      const createdAt = admin.firestore.FieldValue.serverTimestamp();

      // 1) 🔐 원문/내부용
      await db.collection("public_secure_leads").add({
        storeName,
        phone,
        message: message || "",

        region,
        inquiryType,
        source: "sms",

        // 참고용 마스킹도 같이 보관(운영 편의)
        displayName,
        displayPhone,
        displayRegion,

        createdAt,
      });

      // 2) 🌐 공개 표시용(비식별만 저장)
      await db.collection("public_leads").add({
        displayName, // ✅ 2글자 + ***
        displayPhone,
        displayRegion,
        inquiryType,
        createdAt,
      });

      console.log("✅ FIRESTORE SAVED (dual-write): public_secure_leads + public_leads");
    } catch (firebaseErr: any) {
      console.error("❌ FIRESTORE FAILED:", firebaseErr?.message || firebaseErr);
      // SMS는 이미 갔으니 사용자 UX는 성공 처리 유지
    }

    return redirect303(req.url, "/sms/sent");
  } catch (err: any) {
    console.error("[sms-lead] error:", err);
    return redirect303(req.url, `/?error=${shortErr(err)}#sms-lead`);
  }
}
