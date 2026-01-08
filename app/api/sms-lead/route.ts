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

// ✅ 지역은 “원문 저장 없이” 키워드만 보고 라벨만 저장
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

function maskStoreName(storeName: string) {
  const s = (storeName || "").trim();
  if (!s) return "익**";
  return `${s[0]}**`;
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

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const storeName = String(formData.get("storeName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!storeName || !phone) {
      return redirect303(req.url, "/?error=invalid_input#sms-lead");
    }

    // ✅ 기존 문자 발송 로직 유지
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

    // ✅ Firestore 공개용 저장(마스킹 + 라벨만)
    try {
      const db = getAdminDb();

      await db.collection("public_leads").add({
        displayName: maskStoreName(storeName),
        displayPhone: maskPhone(phone),
        displayRegion: detectRegion(message), // ✅ 추가
        inquiryType: detectInquiryType(message), // 문의내용(유형)
        source: "sms",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (firebaseErr: any) {
      console.error("⚠️ Firestore log failed:", firebaseErr?.message || firebaseErr);
    }

    return redirect303(req.url, "/sms/sent");
  } catch (err: any) {
    console.error("❌ SMS ERROR:", err);
    return redirect303(req.url, `/?error=${shortErr(err)}#sms-lead`);
  }
}
