// app/_sections/WhySection.tsx
"use client";

export default function WhySection() {
  return (
    <div className="group rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 ring-1 ring-emerald-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50/60 hover:shadow-lg hover:shadow-emerald-100/50 hover:ring-emerald-200 active:translate-y-0 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span aria-hidden>🏭</span>
            <span>신뢰 포인트</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">왜 이가에프엔비인가</h2>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🏭
        </div>
      </div>

      <ul className="mt-4 grid gap-3 text-sm text-gray-800 md:grid-cols-2">
        <li>✔ HACCP 인증 공장 직접 생산</li>
        <li>✔ 유통단계 최소화 → 진짜 B2B 단가</li>
        <li>✔ 실생산 · 실포장 현장 운영</li>
        <li>✔ 문제 발생 시 교환·환불 기준 명확</li>
      </ul>

      <div className="mt-5 h-1 w-full rounded-full bg-emerald-200 transition-opacity duration-200 group-hover:opacity-90" aria-hidden />
    </div>
  );
}
