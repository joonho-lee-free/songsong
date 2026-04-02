"use client";

import { useEffect, useMemo, useState } from "react";

const WHY_IMAGES = [
  { src: "/images/whysection/why-01.jpg", alt: "HACCP인증공장", label: "공장직영" },
  { src: "/images/whysection/why-02.jpg", alt: "수제닭꼬치 직접생산", label: "직접생산" },
  { src: "/images/whysection/why-03.jpg", alt: "직접생산 전국유통", label: "전국유통" },
  { src: "/images/whysection/why-04.jpg", alt: "HACCP인증 안전한 먹거리", label: "HACCP인증" },
] as const;

export default function WhySection() {
  const [play, setPlay] = useState(false);
  const [openImage, setOpenImage] = useState<string | null>(null);

  const YOUTUBE_ID = "AHHHdwxHzgY";

  const thumbUrl = useMemo(
    () => `https://img.youtube.com/vi/${YOUTUBE_ID}/hqdefault.jpg`,
    [YOUTUBE_ID]
  );

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
    <div className="group rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 ring-1 ring-emerald-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50/60 hover:shadow-lg hover:shadow-emerald-100/50 hover:ring-emerald-200 active:translate-y-0 md:p-8">
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

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span aria-hidden>🌴</span>
                <span>왜 다이렉트인가</span>
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                다이렉트거래 제안이유
              </h2>
            </div>

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
              aria-hidden
            >
              🌴
            </div>
          </div>

          <ul className="mt-4 grid gap-3 text-sm text-gray-800">
            <li>✔ 유통 중간마진 없이, HACCP공장 다이렉트 최저가!</li>
            <li>✔ 같은 닭꼬치라도 생산방식에 따라 품질은 완전히 달라집니다.</li>
            <li>✔ 원하는 닭꼬치 OEM생산 가능, 직접생산 전국유통</li>
            <li>✔ 돌려 말하지 않는 투명견적, 공장에서 바로 드립니다</li>
          </ul>

         
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            ※ 일반 소매가 아닙니다. 프랜차이즈·대형마트 납품가 기준으로 맞춥니다
            <span className="font-semibold text-gray-900">
              {" "}잘 팔리는 닭꼬치, 업소는 바로 압니다.
            </span>
            
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-black ring-1 ring-emerald-100/60">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            {!play ? (
              <>
                <img
                  src={thumbUrl}
                  alt="코사무이 소개 영상 썸네일"
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
                title="수제닭꼬치 제작영상"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>

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
                onClick={() => setOpenImage(img.src)}
                className="absolute inset-0 h-full w-full cursor-zoom-in object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/35 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm md:bottom-3 md:right-3 md:text-sm">
                {img.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 h-1 w-full rounded-full bg-emerald-200 transition-opacity duration-200 group-hover:opacity-90"
        aria-hidden
      />

      {openImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="이미지 확대 보기"
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpenImage(null)}
              className="absolute -right-3 -top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="닫기"
            >
              <span className="text-xl leading-none">×</span>
            </button>

            <img
              src={openImage}
              alt="확대 이미지"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />

            <div className="mt-3 text-center text-xs text-white/80">
              배경을 누르거나 <b>ESC</b> 또는 <b>×</b>로 닫을 수 있어요.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}