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
          <h2 className="mt-3 text-lg font-bold md:text-xl">주문 진행 순서</h2>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🧾
        </div>
      </div>

      {/* ✅ 이미지 제거, 텍스트 안내만 */}
      <ol className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li>1️⃣ 문의 접수 / 담당자상담</li>
        <li>2️⃣ 발주GO 계정 발급</li>
        <li>3️⃣ 충전 후 주문</li>
        <li>4️⃣ 출고 · 배송</li>
      </ol>

      <p className="mt-3 text-sm text-gray-600">
        ※ 첫 거래 시 담당자가 직접 안내드립니다.
      </p>

      <div
        className="mt-5 h-1 w-full rounded-full bg-rose-200 transition-opacity duration-200 group-hover:opacity-90"
        aria-hidden
      />
    </div>
  );
}
