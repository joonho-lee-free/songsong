// app/_sections/ProductSection.tsx
"use client";

export default function ProductSection() {
  return (
    <div className="group rounded-2xl border border-violet-100 bg-violet-50/40 p-6 ring-1 ring-violet-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50/60 hover:shadow-lg hover:shadow-violet-100/50 hover:ring-violet-200 active:translate-y-0 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
            <span aria-hidden>🍢</span>
            <span>제품 라인업</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">제품 구성</h2>
          <p className="mt-2 text-sm text-gray-700">
            업소 운영에 가장 많이 사용되는 닭꼬치 위주 구성
          </p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🍢
        </div>
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-3">
        <li>• 왕순살 / 왕파닭</li>
        <li>• 일본식 순살 / 일본식 파닭</li>
        <li>• 염통 / 닭껍질</li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">
        ※ 전 제품 <b>박스 단위 · B2B 납품 전용</b>
      </p>

      <div className="mt-5 h-1 w-full rounded-full bg-violet-200 transition-opacity duration-200 group-hover:opacity-90" aria-hidden />
    </div>
  );
}
