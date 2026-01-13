// app/_sections/BodyCardsSection.tsx
"use client";

import { useMemo } from "react";
import FitForSection from "./FitForSection";
import WhySection from "./WhySection";
import ProductSection from "./ProductSection";
import OrderGoSection from "./OrderGoSection";
import MarketingSection from "./MarketingSection";
import ProcessSection from "./ProcessSection";

export default function BodyCardsSection() {
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

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 md:px-8">
      {/* ✅ 모바일 gap-10 / 데스크탑 gap-12 (기존 유지) */}
      <div className="grid gap-10 md:gap-12">
        {items.map((it) => (
          <div key={it.key}>{it.node}</div>
        ))}
      </div>
    </section>
  );
}
