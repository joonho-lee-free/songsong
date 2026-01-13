// app/_sections/ProcessSection.tsx
"use client";

export default function ProcessSection() {
  return (
    <div className="group rounded-2xl border border-rose-100 bg-rose-50/40 p-6 ring-1 ring-rose-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-rose-200 hover:bg-rose-50/60 hover:shadow-lg hover:shadow-rose-100/50 hover:ring-rose-200 active:translate-y-0 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-900">
            <span aria-hidden>🧾</span>
            <span>진행 절차</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">
           최저가 납품 진행 절차 안내
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            공장직영 구조로 <span className="font-semibold text-gray-800">국내 최저가 수준</span>을
            지향하며, 매장 기준에 맞춰 안내드립니다.
          </p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🧾
        </div>
      </div>

      {/* 텍스트 절차 안내 */}
      <ol className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li>1️⃣ 상담 요청 (매장 형태 · 지역 · 예상 물량 확인)</li>
        <li>
          2️⃣ 조건 안내 (
          <span className="font-medium text-gray-900">
            국내 최저가 수준 단가
          </span>
          · 최소수량 · 납품 방식)
        </li>
        <li>3️⃣ 샘플 테스트 (해당 시, 상담 후 가능 여부 안내)</li>
        <li>4️⃣ 거래 진행 (출고 · 배송 / 정기·단발 납품)</li>
      </ol>

      <p className="mt-3 text-sm text-gray-600">
        ※ 업소 운영 고객 대상 안내이며, 물량·지역·계약 조건에 따라 단가가 달라질 수 있습니다.
      </p>

      <div
        className="mt-5 h-1 w-full rounded-full bg-rose-200 transition-opacity duration-200 group-hover:opacity-90"
        aria-hidden
      />
    </div>
  );
}
