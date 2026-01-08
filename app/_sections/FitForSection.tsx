// app/_sections/FitForSection.tsx
"use client";

export default function FitForSection() {
  return (
    <div className="group rounded-2xl border border-blue-100 bg-blue-50/40 p-6 ring-1 ring-blue-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-lg hover:shadow-blue-100/50 hover:ring-blue-200 active:translate-y-0 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            <span aria-hidden>🎯</span>
            <span>추천 대상</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">이런 사장님께 맞습니다</h2>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🎯
        </div>
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li>✔ 닭꼬치 전문점 / 포장마차 / 호프집</li>
        <li>✔ 푸드트럭 / 야시장 / 행사 운영</li>
        <li>✔ 프랜차이즈 가맹점</li>
        <li>✔ 안정적인 납품처가 필요한 업소</li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">
        ※ 개인 소비자 판매가 아닌 <b>사업자 전용 납품</b>입니다.
      </p>

      <div className="mt-5 h-1 w-full rounded-full bg-blue-200 transition-opacity duration-200 group-hover:opacity-90" aria-hidden />
    </div>
  );
}
