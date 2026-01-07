"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function CallRedirectPage() {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    // 1) GA4 이벤트 먼저 전송
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "call_click", {
        event_category: "lead",
        event_label: "call_redirect",
      });
    }

    // 2) 잠깐 기다렸다가 전화 앱으로 이동 (이게 전송 성공률을 확 올림)
    const t1 = setTimeout(() => {
      window.location.href = "tel:051-714-3396";
    }, 300);

    // UI용 카운트다운(선택)
    const t2 = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearInterval(t2);
    };
  }, []);

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        전화 연결 중…
      </h1>
      <p style={{ marginBottom: 16, lineHeight: 1.6 }}>
        {countdown > 0 ? `${countdown}초 후 전화 앱으로 이동합니다.` : "전화 앱을 여는 중입니다."}
        <br />
        자동으로 열리지 않으면 아래 버튼을 눌러 주세요.
      </p>

      <a
        href="tel:051-714-3396"
        style={{
          display: "inline-block",
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #ddd",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        📞 지금 전화하기
      </a>

      <div style={{ marginTop: 18 }}>
        <a href="/" style={{ textDecoration: "underline" }}>
          ← 홈으로 돌아가기
        </a>
      </div>
    </main>
  );
}
