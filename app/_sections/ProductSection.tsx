"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ProductGalleryModal from "../_components/ProductGalleryModal";

type ProductItem = {
  id: string;
  cover: string;
  alt: string;
  label: string;
  description: string;
  images: string[];
};

export default function ProductSection() {
  const productItems: ProductItem[] = useMemo(
    () => [
      {
        id: "product-01",
        cover: "/images/productsection/product-01.jpg",
        alt: "왕순살왕파닭",
        label: "왕순살꼬치 110g / 1,050원",
        description: "1봉 15개 (10봉입) / 1박스 150개",
        images: [
          "/images/productsection/01/01.jpg",
          "/images/productsection/01/02.jpg",
          "/images/productsection/01/03.jpg",
          "/images/productsection/01/04.jpg",
          "/images/productsection/01/05.jpg",
          "/images/productsection/01/06.jpg",

        ],
      },
      {
        id: "product-02",
        cover: "/images/productsection/product-02.jpg",
        alt: "왕파닭꼬치",
        label: "왕파닭꼬치 110g / 1,150원",
        description: "1봉 15개 (8봉입) / 1박스 120개",
        images: [
          "/images/productsection/02/01.jpg",
          "/images/productsection/02/02.jpg",
          "/images/productsection/02/03.jpg",
          "/images/productsection/02/04.jpg",
          "/images/productsection/02/05.jpg",
          "/images/productsection/02/06.jpg",
        ],
      },
      {
        id: "product-03",
        cover: "/images/productsection/product-03.jpg",
        alt: "일본식순살꼬치",
        label: "일본식순살 50g / 700원",
        description: "1봉 15개 (10봉입) / 1박스 150개",
        images: [
          "/images/productsection/03/01.jpg",
          "/images/productsection/03/02.jpg",
          "/images/productsection/03/03.jpg",
          "/images/productsection/03/04.jpg",
          "/images/productsection/03/05.jpg",
          "/images/productsection/03/06.jpg",
        ],
      },
      {
        id: "product-04",
        cover: "/images/productsection/product-04.jpg",
        alt: "일본식파닭꼬치",
        label: "일본식파닭 50g / 750원",
        description: "1봉 15개 (8봉입) / 1박스 120개",
        images: [
          "/images/productsection/04/01.jpg",
          "/images/productsection/04/02.jpg",
          "/images/productsection/04/03.jpg",
          "/images/productsection/04/04.jpg",
          "/images/productsection/04/05.jpg",
          "/images/productsection/04/06.jpg",
        ],
      },
      {
        id: "product-05",
        cover: "/images/productsection/product-05.jpg",
        alt: "무릎연골꼬치",
        label: "무릎연골꼬치 40g / 800원",
        description: "1봉 20개 (10봉입) / 1박스 200개",
        images: [
          "/images/productsection/05/01.jpg",
          "/images/productsection/05/02.jpg",
          "/images/productsection/05/03.jpg",
          "/images/productsection/05/04.jpg",
          "/images/productsection/05/05.jpg",
          "/images/productsection/05/06.jpg",
        ],
      },
      {
        id: "product-06",
        cover: "/images/productsection/product-06.jpg",
        alt: "닭껍질꼬치",
        label: "닭껍질꼬치 40g / 650원",
        description: "1봉 20개 (10봉입) / 1박스 200개",
        images: [
          "/images/productsection/06/01.jpg",
          "/images/productsection/06/02.jpg",
          "/images/productsection/06/03.jpg",
          "/images/productsection/06/04.jpg",
          "/images/productsection/06/05.jpg",
          "/images/productsection/06/06.jpg",
        ],
      },
      {
        id: "product-07",
        cover: "/images/productsection/product-07.jpg",
        alt: "염통꼬치",
        label: "염통꼬치 40g / 800원",
        description: "1봉 40개 (6봉입) / 1박스 240개",
        images: [
          "/images/productsection/07/01.jpg",
          "/images/productsection/07/02.jpg",
          "/images/productsection/07/03.jpg",
          "/images/productsection/07/04.jpg",
          "/images/productsection/07/05.jpg",
          "/images/productsection/07/06.jpg",
        ],
      },
      {
        id: "product-08",
        cover: "/images/productsection/product-08.jpg",
        alt: "HACCP인증시설",
        label: "HACCP 인증공장",
        description: "안심하고 구매하세요",
        images: [
          "/images/productsection/08/01.jpg",
          "/images/productsection/08/02.jpg",
          "/images/productsection/08/03.jpg",
          "/images/productsection/08/04.jpg",
          "/images/productsection/08/05.jpg",
          "/images/productsection/08/06.jpg",
        ],
      },
    ],
    []
  );

  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);

  const selectedImages = selectedItem
    ? selectedItem.images.length > 0
      ? selectedItem.images
      : [selectedItem.cover]
    : [];

  return (
    <>
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
              <span>HACCP인증공장 수제닭꼬치 라인업</span>
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">프랜차이즈 납품환영 <br />B2B가격 제품라인업</h2>
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
          <li>• 왕순살/파닭꼬치(닭다리살) 110g*25cm</li>
          <li>• 일본식순살/파닭(닭다리살) 50g*18cm</li>
          <li>• 무릎연골꼬치 40g*18cm</li>
          <li>• 염통꼬치 / 닭껍질꼬치 40g*18cm</li>
        </ul>

        <p className="mt-3 text-sm text-gray-600">
          ※ 전 제품 <b>박스 단위 · B2B 납품 전용</b>
        </p>

        <div className="ss-product-grid mt-4">
          {productItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className="min-w-0 overflow-hidden rounded-xl border border-violet-100 bg-white/60 text-left ring-1 ring-violet-100/60 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
                <Image
                  src={item.cover}
                  alt={item.alt}
                  fill
                  className="object-cover object-center transition duration-300 hover:scale-105"
                />

                <div className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow">
                  사진보기
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />

                <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/35 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm md:bottom-3 md:right-3 md:text-sm">
                  {item.label}
                </div>
              </div>

              <div className="px-3 py-3">
                <p className="text-sm leading-relaxed text-gray-700">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div
          className="mt-5 h-1 w-full rounded-full bg-violet-200 transition-opacity duration-200 group-hover:opacity-90"
          aria-hidden
        />
      </div>

      <ProductGalleryModal
        open={!!selectedItem}
        title={selectedItem?.label ?? ""}
        images={selectedImages}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}