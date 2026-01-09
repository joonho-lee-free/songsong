// app/_sections/BodyCardsSection.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FitForSection from "./FitForSection";
import WhySection from "./WhySection";
import ProductSection from "./ProductSection";
import OrderGoSection from "./OrderGoSection";
import MarketingSection from "./MarketingSection";
import ProcessSection from "./ProcessSection";

export default function BodyCardsSection() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const items = useMemo(
    () => [
      { key: "fit", node: <FitForSection /> },
      { key: "why", node: <WhySection /> },
      { key: "product", node: <ProductSection /> },
      { key: "ordergo", node: <OrderGoSection /> },

      // ✅ 추가: “주문 진행 순서” 위에 마케팅 섹션
      { key: "marketing", node: <MarketingSection /> },

      { key: "process", node: <ProcessSection /> },
    ],
    []
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 md:px-8">
      <style jsx global>{`
        @keyframes ss-stagger-in {
          from {
            opacity: 0;
            transform: translate3d(0, 14px, 0);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            filter: blur(0);
          }
        }
        .ss-stagger-item {
          opacity: 0;
          transform: translate3d(0, 14px, 0);
          will-change: transform, opacity, filter;
        }
        .ss-stagger-item.is-in {
          animation-name: ss-stagger-in;
          animation-duration: 560ms;
          animation-timing-function: cubic-bezier(0.2, 0.9, 0.2, 1);
          animation-fill-mode: forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .ss-stagger-item {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
            filter: none !important;
          }
        }
      `}</style>

      {/* ✅ 모바일 gap-10 / 데스크탑 gap-12 */}
      <div ref={wrapRef} className="grid gap-10 md:gap-12">
        {items.map((it, idx) => (
          <div
            key={it.key}
            className={`ss-stagger-item ${inView ? "is-in" : ""}`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {it.node}
          </div>
        ))}
      </div>
    </section>
  );
}
