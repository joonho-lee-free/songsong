"use client";

import { useEffect, useState } from "react";

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
  // ✅ 클릭한 이미지 확대(라이트박스)
  const [openImage, setOpenImage] = useState<string | null>(null);

  // ✅ ESC로 닫기 + 열려있을 때 배경 스크롤 방지
  useEffect(() => {
    if (!openImage) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenImage(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openImage]);

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
              {/* 이미지 (✅ 클릭 시 확대) */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onClick={() => setOpenImage(img.src)}
                className="absolute inset-0 h-full w-full cursor-zoom-in object-cover object-center"
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

      {/* ✅ 라이트박스(뉴스처럼 클릭하면 크게 보기) + 닫기 버튼 */}
      {openImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenImage(null)} // ✅ 배경 클릭하면 닫힘
          role="dialog"
          aria-modal="true"
          aria-label="이미지 확대 보기"
        >
          {/* ✅ 중앙 컨테이너 (닫기 버튼 포함) */}
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // ✅ 이미지 영역 클릭은 닫히지 않게
          >
            {/* ✅ 닫기 버튼 (우상단 X) */}
            <button
              type="button"
              onClick={() => setOpenImage(null)}
              className="absolute -right-3 -top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="닫기"
            >
              <span className="text-xl leading-none">×</span>
            </button>

            {/* ✅ 확대 이미지 */}
            <img
              src={openImage}
              alt="확대 이미지"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />

            {/* ✅ 하단 힌트(선택): 뉴스처럼 안내 문구 */}
            <div className="mt-3 text-center text-xs text-white/80">
              배경을 누르거나 <b>ESC</b> 또는 <b>×</b>로 닫을 수 있어요.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
