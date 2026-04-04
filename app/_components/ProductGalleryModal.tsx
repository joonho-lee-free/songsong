"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type ProductGalleryModalProps = {
  open: boolean;
  title: string;
  images: string[];
  onClose: () => void;
};

export default function ProductGalleryModal({
  open,
  title,
  images,
  onClose,
}: ProductGalleryModalProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!open) return;

    setCurrent(0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "ArrowLeft") {
        setCurrent((prev) =>
          prev === 0 ? safeImages.length - 1 : prev - 1
        );
      }

      if (e.key === "ArrowRight") {
        setCurrent((prev) =>
          prev === safeImages.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, safeImages.length]);

  if (!open) return null;

  const hasImages = safeImages.length > 0;

  const goPrev = () => {
    if (!hasImages) return;
    setCurrent((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    if (!hasImages) return;
    setCurrent((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 md:px-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 md:text-xl">
              {title} 갤러리
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              좌우 버튼으로 사진을 넘겨볼 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            닫기
          </button>
        </div>

        {hasImages ? (
          <>
            <div className="relative aspect-[4/3] w-full bg-black md:aspect-[16/9]">
              <Image
                src={safeImages[current]}
                alt={`${title} 사진 ${current + 1}`}
                fill
                className="object-cover"
                priority
              />

              {safeImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-lg font-bold text-white backdrop-blur hover:bg-black/60"
                    aria-label="이전 사진"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-lg font-bold text-white backdrop-blur hover:bg-black/60"
                    aria-label="다음 사진"
                  >
                    ›
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
                {current + 1} / {safeImages.length}
              </div>
            </div>

            {safeImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 border-t border-gray-100 bg-gray-50 p-3 md:grid-cols-6 md:p-4">
                {safeImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    className={`relative aspect-square overflow-hidden rounded-lg border ${
                      idx === current
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${title} 썸네일 ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-16 text-center text-gray-500">
            등록된 사진이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}