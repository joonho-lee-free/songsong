import { NextResponse } from "next/server";
import CoolSMS from "coolsms-node-sdk";

export const runtime = "nodejs";

function shortErr(err: any) {
  const name = err?.name || "Error";
  const msg = err?.message || "unknown";
  return encodeURIComponent(`${name}:${String(msg).slice(0, 80)}`);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const storeName = String(formData.get("storeName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!storeName || !phone) {
      return NextResponse.redirect(
        new URL("/?error=invalid_input#sms-lead", req.url)
      );
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
      return NextResponse.redirect(
        new URL("/?error=server_env#sms-lead", req.url)
      );
    }

    const norm = (s: string) => s.replace(/[^0-9]/g, "");
    const fromN = norm(from);
    const toN = norm(to);
    if (fromN.length < 10 || toN.length < 10) {
      console.error("❌ Phone format invalid", { from, to });
      return NextResponse.redirect(
        new URL("/?error=bad_phone_env#sms-lead", req.url)
      );
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

    // ✅ 성공 시: 전환 전용 페이지로 보내서 (클라이언트에서 fbq/gtag 실행)
    return NextResponse.redirect(new URL("/sms/sent", req.url));
  } catch (err: any) {
    console.error("❌ SMS ERROR name:", err?.name);
    console.error("❌ SMS ERROR message:", err?.message);
    console.error("❌ SMS ERROR stack:", err?.stack);
    console.error("❌ SMS ERROR raw:", err);

    return NextResponse.redirect(
      new URL(`/?error=${shortErr(err)}#sms-lead`, req.url)
    );
  }
}
