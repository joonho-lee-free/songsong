import { NextResponse } from "next/server";
import CoolSMS from "coolsms-node-sdk";

export const runtime = "nodejs";

function shortErr(err: any) {
  const name = err?.name || "Error";
  const msg = err?.message || "unknown";
  return encodeURIComponent(`${name}:${String(msg).slice(0, 80)}`);
}

/**
 * ✅ POST 응답에서 redirect는 303을 써야 브라우저가 GET으로 따라감
 * - NextResponse.redirect 기본은 307 (메소드 유지) → /sms/sent 가 POST로 호출되어 405 발생
 */
function redirect303(reqUrl: string, pathWithHash: string) {
  return NextResponse.redirect(new URL(pathWithHash, reqUrl), { status: 303 });
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

    // ✅ 성공 시: /sms/sent 로 이동 (반드시 303)
    return redirect303(req.url, "/sms/sent");
  } catch (err: any) {
    console.error("❌ SMS ERROR name:", err?.name);
    console.error("❌ SMS ERROR message:", err?.message);
    console.error("❌ SMS ERROR stack:", err?.stack);
    console.error("❌ SMS ERROR raw:", err);

    return redirect303(req.url, `/?error=${shortErr(err)}#sms-lead`);
  }
}
