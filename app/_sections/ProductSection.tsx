"use client";

import { useEffect, useState } from "react";

const PRODUCT_IMAGES = [
  {
    src: "/images/productsection/product-01.jpg",
    alt: "왕순살왕파닭",
    label: "왕순살꼬치 110g / 1,050원",
    description: "1봉 15개 (10봉입) / 1박스 150개",
  },
  {
    src: "/images/productsection/product-02.jpg",
    alt: "왕파닭꼬치",
    label: "왕파닭꼬치 110g / 1,150원",
    description: "1봉 15개 (8 봉입)  / 1박스 120개",
  },
  {
    src: "/images/productsection/product-03.jpg",
    alt: "일본식순살꼬치",
    label: "일본식순살 50g / 700원",
    description: "1봉 15개 (10봉입) / 1박스 150개",
  },
  {
    src: "/images/productsection/product-04.jpg",
    alt: "일본식파닭꼬치",
    label: "일본식파닭 50g / 750원",
    description: "1봉 15개 (8 봉입)  / 1박스 120개",
  },
  {
    src: "/images/productsection/product-05.jpg",
    alt: "무릎연골꼬치",
    label: "무릎연골꼬치 40g / 800원",
    description: "1봉 20개 (10봉입)  / 1박스 200개",
  },
  {
    src: "/images/productsection/product-06.jpg",
    alt: "닭껍질꼬치",
    label: "닭껍질꼬치 40g / 650원",
    description: "1봉 20개 (10봉입)  / 1박스 200개",
  },
  {
    src: "/images/productsection/product-07.jpg",
    alt: "염통꼬치",
    label: "염통꼬치 40g / 800원",
    description: "1봉 40개 (6 봉입)  / 1박스 240개",
  },
  {
    src: "/images/productsection/product-08.jpg",
    alt: "HACCP인증시설",
    label: "HACCP 인증공장",
    description: "안심하고 구매하세요",
  },
] as const;

export default function ProductSection() {
  const [openImage, setOpenImage] = useState<string | null>(null);

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
    <div className="group rounded-2xl border border-violet-100 bg-violet-50/40 p-6 ring-1 ring-violet-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50/60 hover:shadow-lg hover:shadow-violet-100/50 hover:ring-violet-200 active:translate-y-0 md:p-8">
      <style jsx global>{`
        .ss-product-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }
        @media (min-width: 768px) {
          .ss-product-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
        }
        .ss-product-grid > * {
          min-width: 0 !important;
          width: auto !important;
          max-width: none !important;
        }
      `}</style>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
            <span aria-hidden>🍢</span>
            <span>제품 라인업</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">제품 구성</h2>
          <p className="mt-2 text-sm text-gray-700">
            업소 운영에 가장 많이 사용되는 닭꼬치
          </p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🍢
        </div>
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li>• 왕순살/파닭꼬치(닭다리살) 110g*25cm </li>
        <li>• 일본식순살/파닭(닭다리살) 50g*18cm</li>
        <li>• 무릎연골꼬치 40g*18cm </li>
        <li>• 염통꼬치 / 닭껍질꼬치 40g*18cm</li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">
        ※ 전 제품 <b>박스 단위 · B2B 납품 전용 </b>
      </p>

      <div className="ss-product-grid mt-4">
        {PRODUCT_IMAGES.map((img) => (
          <div
            key={img.src}
            className="min-w-0 overflow-hidden rounded-xl border border-violet-100 bg-white/60 ring-1 ring-violet-100/60"
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

            <div className="px-3 py-3">
              <p className="text-sm leading-relaxed text-gray-700">
                {img.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 h-1 w-full rounded-full bg-violet-200 transition-opacity duration-200 group-hover:opacity-90"
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