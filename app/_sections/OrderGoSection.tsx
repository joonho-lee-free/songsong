// app/_sections/OrderGoSection.tsx
"use client";

export default function OrderGoSection() {
  return (
    <div className="group rounded-2xl border border-amber-100 bg-amber-50/40 p-6 ring-1 ring-amber-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-amber-200 hover:bg-amber-50/60 hover:shadow-lg hover:shadow-amber-100/50 hover:ring-amber-200 active:translate-y-0 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            <span aria-hidden>📲</span>
            <span>주문 편의</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">발주GO로 주문이 편합니다</h2>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          📲
        </div>
      </div>

      <ul className="mt-4 grid gap-3 text-sm text-gray-800 md:grid-cols-2">
        <li>✔ 모바일 / 앱으로 언제든 주문</li>
        <li>✔ 품목·수량 한눈에 확인</li>
        <li>✔ 전용계좌 충전 후 즉시 주문</li>
        <li>✔ 주문·배송 내역 자동 관리</li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">
        전화·카톡 주문 없이도 안정적으로 발주 가능합니다.
      </p>

      <div className="mt-5 h-1 w-full rounded-full bg-amber-200 transition-opacity duration-200 group-hover:opacity-90" aria-hidden />
    </div>
  );
}
