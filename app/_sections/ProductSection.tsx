"use client";

const PRODUCT_IMAGES = [
  { src: "/images/productsection/product-01.jpg", alt: "왕순살왕파닭", label: "왕순살꼬치" },
  { src: "/images/productsection/product-02.jpg", alt: "일본식순살파닭", label: "일본식파닭" },
  { src: "/images/productsection/product-03.jpg", alt: "염통꼬치", label: "염통꼬치" },
  { src: "/images/productsection/product-04.jpg", alt: "닭껍질꼬치", label: "닭껍질꼬치" },
] as const;

export default function ProductSection() {
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

      <ul className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li>• 왕순살 150개 / 왕파닭 120개 / 25cm*110g </li>
        <li>• 일본식순살 150개 / 일본식파닭 120개 / 이자까야용 / 18cm*50g </li>
        <li>• 염통꼬치 240ea / 닭껍질꼬치 200ea / 18cm 35g 40g</li>
      </ul>


      <p className="mt-3 text-sm text-gray-600">
        ※ 전 제품 <b>박스 단위 · B2B 납품 전용 · 제품명 옆 박스별 꼬치개수</b>
      </p>

      {/* ✅ 이미지 4장 추가 */}
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

      <div
        className="mt-5 h-1 w-full rounded-full bg-violet-200 transition-opacity duration-200 group-hover:opacity-90"
        aria-hidden
      />
    </div>
  );
}
