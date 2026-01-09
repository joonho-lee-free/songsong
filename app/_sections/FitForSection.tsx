"use client";

const FIT_IMAGES = [
  {
    src: "/images/fitforsection/fit-01.jpg",
    alt: "닭꼬치 굽는 장면",
    label: "현장 조리",
  },
  {
    src: "/images/fitforsection/fit-02.jpg",
    alt: "야시장/행사 운영 분위기",
    label: "행사 · 야시장",
  },
  {
    src: "/images/fitforsection/fit-03.jpg",
    alt: "푸드트럭 운영 장면",
    label: "푸드트럭",
  },
  {
    src: "/images/fitforsection/fit-04.jpg",
    alt: "매장 운영 참고 이미지",
    label: "매장 운영",
  },
] as const;

export default function FitForSection() {
  return (
    <div className="group rounded-2xl border border-blue-100 bg-blue-50/40 p-6 ring-1 ring-blue-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-lg hover:shadow-blue-100/50 hover:ring-blue-200 active:translate-y-0 md:p-8">
      {/* ✅ 전역 CSS가 있어도 “한줄 4장” 절대 안 깨지게 강제 */}
      <style jsx global>{`
        .ss-fit-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }
        @media (min-width: 768px) {
          .ss-fit-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
        }
        .ss-fit-grid > * {
          min-width: 0 !important;
          width: auto !important;
          max-width: none !important;
        }
      `}</style>

      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            <span aria-hidden>🎯</span>
            <span>추천 대상</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">
            이런 사장님께 맞습니다
          </h2>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🎯
        </div>
      </div>

      {/* 안내데이터 */}
      <ul className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li>✔ 닭꼬치 전문점 / 포장마차 / 호프집</li>
        <li>✔ 푸드트럭 / 야시장 / 행사 운영</li>
        <li>✔ 프랜차이즈 가맹점</li>
        <li>✔ 안정적인 납품처가 필요한 업소</li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">
        ※ 개인 소비자 판매가 아닌 <b>사업자 전용 납품</b>입니다.
      </p>

      {/* ✅ 이미지 4장: PC 한줄 / 모바일 2x2 + 텍스트 오버레이 */}
      <div className="ss-fit-grid mt-4">
        {FIT_IMAGES.map((img) => (
          <div
            key={img.src}
            className="min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-white/60 ring-1 ring-blue-100/60"
          >
            {/* 프레임(클리핑 마스크) */}
            <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
              {/* 이미지 */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              {/* ✅ 텍스트가 안 묻히게: 어두운 그라데이션 레이어 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />

              {/* ✅ 오른쪽 하단 텍스트 (흰색/볼드) + z-index */}
              <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/35 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm md:bottom-3 md:right-3 md:text-sm">
                {img.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 h-1 w-full rounded-full bg-blue-200" aria-hidden />
    </div>
  );
}
