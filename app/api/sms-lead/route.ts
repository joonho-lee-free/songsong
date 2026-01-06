// 파일위치: app/api/sms-lead/route.ts
// 파일명: route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { SolapiMessageService } from "solapi";

// 간단 레이트리밋(서버리스에서 완벽하진 않지만 1차 방어용)
const hitMap = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1분
const MAX_PER_WINDOW = 5;

function digitsOnly(s: string) {
  return (s || "").replace(/\D/g, "");
}

function isValidKoreanMobile(phone: string) {
  // 010xxxxxxxx(11자리) + 011~019(10~11자리)도 허용
  return /^01[016789]\d{7,8}$/.test(phone);
}

export async function POST(req: Request) {
  try {
    // --- 레이트리밋 (IP 기준) ---
    const h = await headers();
    const ipRaw = h.get("x-forwarded-for") || h.get("x-real-ip") || "unknown";
    const ip = ipRaw.split(",")[0].trim();

    const now = Date.now();
    const prev = hitMap.get(ip);
    if (!prev || now - prev.ts > WINDOW_MS) {
      hitMap.set(ip, { count: 1, ts: now });
    } else {
      prev.count += 1;
      if (prev.count > MAX_PER_WINDOW) {
        return NextResponse.redirect(new URL("/?error=rate_limited#sms-lead", req.url), {
          status: 303,
        });
      }
    }

    // --- 폼 데이터 파싱 ---
    const form = await req.formData();

    const storeName = String(form.get("storeName") || "").trim();
    const phone = digitsOnly(String(form.get("phone") || ""));
    const message = String(form.get("message") || "").trim();
    const consent = String(form.get("consent") || "") === "1";

    // --- 기본 검증 ---
    if (!consent) {
      return NextResponse.redirect(new URL("/?error=no_consent#sms-lead", req.url), {
        status: 303,
      });
    }

    if (!storeName || storeName.length < 2) {
      return NextResponse.redirect(new URL("/?error=bad_store#sms-lead", req.url), {
        status: 303,
      });
    }

    if (!isValidKoreanMobile(phone)) {
      return NextResponse.redirect(new URL("/?error=bad_phone#sms-lead", req.url), {
        status: 303,
      });
    }

    // --- 환경변수 로드 ---
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;

    // 발신번호(사전등록된 번호, 하이픈 없이 권장)
    const from = digitsOnly(process.env.SOLAPI_FROM || "");

    // 수신번호(내 폰)
    const to = digitsOnly(process.env.SOLAPI_TO || "");

    if (!apiKey || !apiSecret || !from || !to) {
      return NextResponse.redirect(new URL("/?error=server_env#sms-lead", req.url), {
        status: 303,
      });
    }

    // --- 문자 내용 구성 ---
    const textLines = [
      "[도매문의 접수]",
      `상호: ${storeName}`,
      `연락처: ${phone}`,
      message ? `내용: ${message}` : "내용: (없음)",
    ];
    const text = textLines.join("\n").slice(0, 1000);

    // --- SOLAPI 발송 ---
    const messageService = new SolapiMessageService(apiKey, apiSecret);
    await messageService.send({
      to,
      from,
      text,
    });

    // --- 성공 시 리다이렉트 ---
    return NextResponse.redirect(new URL("/?sent=1#sms-lead", req.url), {
      status: 303,
    });
  } catch {
    return NextResponse.redirect(new URL("/?error=unknown#sms-lead", req.url), {
      status: 303,
    });
  }
}
