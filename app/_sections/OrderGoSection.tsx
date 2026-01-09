"use client";

const ORDER_IMAGES = [
  { src: "/images/ordersection/order-01.jpg", alt: "앱 주문", label: "앱 주문" },
  { src: "/images/ordersection/order-02.jpg", alt: "품목/수량 확인", label: "한눈에 확인" },
  { src: "/images/ordersection/order-03.jpg", alt: "전용계좌 충전", label: "간편주문" },
  { src: "/images/ordersection/order-04.jpg", alt: "주문/배송 관리", label: "내역관리" },
] as const;

export default function OrderGoSection() {
  return (
    <div className="group rounded-2xl border border-amber-100 bg-amber-50/40 p-6 ring-1 ring-amber-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-amber-200 hover:bg-amber-50/60 hover:shadow-lg hover:shadow-amber-100/50 hover:ring-amber-200 active:translate-y-0 md:p-8">
      <style jsx global>{`
        .ss-order-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }
        @media (min-width: 768px) {
          .ss-order-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
        }
        .ss-order-grid > * {
          min-width: 0 !important;
          width: auto !important;
          max-width: none !important;
        }
      `}</style>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            <span aria-hidden>📲</span>
            <span>주문 편의</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">발주GO로 주문이 편합니다</h2>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          📲
        </div>
      </div>

      <ul className="mt-4 grid gap-3 text-sm text-gray-800 md:grid-cols-2">
        <li>✔ 모바일 / 앱으로 언제든 주문</li>
        <li>✔ 품목·수량 한눈에 확인</li>
        <li>✔ 전용계좌 충전 후 즉시 주문</li>
        <li>✔ 주문·배송 내역 자동 관리</li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">
        전화·카톡 주문 없이도 안정적으로 발주 가능합니다.
      </p>

      {/* ✅ 이미지 4장 추가 */}
      <div className="ss-order-grid mt-4">
        {ORDER_IMAGES.map((img) => (
          <div
            key={img.src}
            className="min-w-0 overflow-hidden rounded-xl border border-amber-100 bg-white/60 ring-1 ring-amber-100/60"
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

      <div className="mt-5 h-1 w-full rounded-full bg-amber-200 transition-opacity duration-200 group-hover:opacity-90" aria-hidden />
    </div>
  );
}
