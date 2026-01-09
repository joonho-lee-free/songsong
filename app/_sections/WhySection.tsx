"use client";

import { useMemo, useState } from "react";

const WHY_IMAGES = [
  { src: "/images/whysection/why-01.jpg", alt: "HACCP 생산 시설", label: "HACCP" },
  { src: "/images/whysection/why-02.jpg", alt: "현장 생산/포장", label: "직접생산" },
  { src: "/images/whysection/why-03.jpg", alt: "대량 포장/출고", label: "전국유통" },
  { src: "/images/whysection/why-04.jpg", alt: "품질 관리", label: "품질 관리" },
] as const;

export default function WhySection() {
  const [play, setPlay] = useState(false);

  // ✅ 유튜브 ID만 교체
  const YOUTUBE_ID = "4rHP0_8m7yg"; // TODO: 실제 ID로 변경

  const thumbUrl = useMemo(
    () => `https://img.youtube.com/vi/${YOUTUBE_ID}/hqdefault.jpg`,
    [YOUTUBE_ID]
  );

  return (
    <div className="group rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 ring-1 ring-emerald-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50/60 hover:shadow-lg hover:shadow-emerald-100/50 hover:ring-emerald-200 active:translate-y-0 md:p-8">
      {/* ✅ 이미지 그리드: 모바일 2칸 / PC 4칸 강제(전역 CSS 방어용) */}
      <style jsx global>{`
        .ss-why-media-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }
        @media (min-width: 768px) {
          .ss-why-media-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
        }
        .ss-why-media-grid > * {
          min-width: 0 !important;
          width: auto !important;
          max-width: none !important;
        }
      `}</style>

      {/* ✅ 상단: 좌(텍스트) / 우(영상) */}
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        {/* 좌측 텍스트 */}
        <div>
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

          <ul className="mt-4 grid gap-3 text-sm text-gray-800">
            <li>✔ HACCP 인증 공장 직접 생산</li>
            <li>✔ 실생산 · 실포장 현장 운영</li>
            <li>✔ 유통단계 최소화 → B2B 단가 → <b>가격비교필수</b></li>
            <li>✔ 문제 발생 시 대응 기준 명확</li>
          </ul>
        </div>

        {/* 우측 영상 */}
        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-black ring-1 ring-emerald-100/60">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            {!play ? (
              <>
                <img
                  src={thumbUrl}
                  alt="소개 영상 썸네일"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-95"
                />
                <div className="absolute inset-0 bg-black/35" />
                <button
                  type="button"
                  onClick={() => setPlay(true)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="영상 재생"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-gray-900 shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    ▶ 영상 재생
                  </div>
                </button>
              </>
            ) : (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="이가에프엔비 소개 영상"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>

      {/* ✅ 하단: 이미지 4장 (모바일 2x2, PC 4x1 고정) */}
      <div className="ss-why-media-grid mt-6">
        {WHY_IMAGES.map((img) => (
          <div
            key={img.src}
            className="min-w-0 overflow-hidden rounded-xl border border-emerald-100 bg-white/60 ring-1 ring-emerald-100/60"
          >
            <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/35 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm md:bottom-3 md:right-3 md:text-sm">
                {img.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 h-1 w-full rounded-full bg-emerald-200 transition-opacity duration-200 group-hover:opacity-90" aria-hidden />
    </div>
  );
}
