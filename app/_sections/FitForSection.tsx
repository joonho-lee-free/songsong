"use client";

import { useEffect, useState } from "react";

const FIT_IMAGES = [
  {
    src: "/images/fitforsection/fit-01.jpg",
    alt: "닭꼬치 전문점 납품",
    label: "전문점 납품",
  },
  {
    src: "/images/fitforsection/fit-02.jpg",
    alt: "포장마차와 호프집 운영",
    label: "포차 · 호프집",
  },
  {
    src: "/images/fitforsection/fit-03.jpg",
    alt: "푸드트럭과 행사 운영",
    label: "행사 · 푸드트럭",
  },
  {
    src: "/images/fitforsection/fit-04.jpg",
    alt: "프랜차이즈 및 대형 납품처",
    label: "프랜차이즈 납품",
  },
] as const;

export default function FitForSection() {
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
    <div className="group rounded-2xl border border-blue-100 bg-blue-50/40 p-6 ring-1 ring-blue-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-lg hover:shadow-blue-100/50 hover:ring-blue-200 active:translate-y-0 md:p-8">
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

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            <span aria-hidden>🎯</span>
            <span>이런 사장님께 잘 맞습니다</span>
          </div>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            프랜차이즈 · 유통 · 대형마트에 들어가는
            <br className="hidden md:block" />
            <span className="text-blue-700">
              B2B 납품단가가 그대로
            </span>
            <br className="hidden md:block" />
            이제 온라인에서 바로 받으세요
          </h2>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🎯
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
        닭꼬치는 아무 데서나 떼와도 팔 수 있습니다.
        <br className="hidden md:block" />
        하지만 <b>계속 주문 들어오는 제품은 맛, 단가, 공급이 같이 맞아야 합니다.</b>
      </p>

      <ul className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li>✔ 닭꼬치 전문점 / 포장마차 / 호프집 운영</li>
        <li>✔ 푸드트럭 / 야시장 / 행사 매대 운영</li>
        <li>✔ 프랜차이즈 가맹점 / 단체 납품처 운영</li>
        <li>✔ 단가와 물량 대응이 중요한 업소</li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">
        ※ 소매용 감성가 아닙니다.{" "}
        <b>프랜차이즈 · 유통 · 대형마트 납품가 기준으로 맞춘 사업자 전용 공급</b>
        입니다.
      </p>

      <div className="ss-fit-grid mt-4">
        {FIT_IMAGES.map((img) => (
          <div
            key={img.src}
            className="min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-white/60 ring-1 ring-blue-100/60"
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

      <div className="mt-5 rounded-2xl border border-blue-200 bg-white/80 p-4 text-sm text-gray-700">
        <p className="font-bold text-slate-900">
          업소는 결국, 잘 팔리는 맛과 남는 단가에 다시 주문합니다
        </p>
        <p className="mt-2 text-gray-600">
          중간마진은 줄이고, 업소 기준에 맞는 맛과 단가,
          <br className="hidden md:block" />
          물량 대응까지 맞춰서 <b>실제 장사되는 조건으로 납품합니다.</b>
        </p>
      </div>

      <div className="mt-5 h-1 w-full rounded-full bg-blue-200" aria-hidden />

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