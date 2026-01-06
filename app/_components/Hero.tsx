import type { Metadata } from "next";
import Hero from "./_components/Hero";
import InquiryBoard from "./_components/InquiryBoard";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "사장님 전용 닭꼬치 도매 납품 | 이가에프엔비",
  description:
    "HACCP 공장직영 닭꼬치. 업소 운영 사장님 전용 B2B 납품. 발주GO로 간편 주문 · 안정적 배송.",
};

const KAKAO_CHAT_URL = "https://pf.kakao.com/___YOUR_CHANNEL/chat"; // TODO: 실제 링크
const CALL_PHONE = "051-714-3396"; // TODO: 실제 번호
const HERO_IMAGE_SRC = "/images/hero/hero-main.webp"; // ✅ 권장 경로

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Hero kakaoChatUrl={KAKAO_CHAT_URL} callPhone={CALL_PHONE} heroImageSrc={HERO_IMAGE_SRC} />

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-8">
        <div className="grid gap-10">
          <div className="rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold md:text-xl">발주·배송까지 한 번에</h2>
            <p className="mt-2 text-sm text-gray-600">
              발주GO를 통해 품목/수량 체크 → 충전 → 주문 → 출고/배송까지 편리하게 진행됩니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a
                href="/inquiry"
                className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
              >
                1:1 문의 게시판 보기
              </a>
              <a
                href="#inquiry"
                className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-900"
              >
                문의 남기기
              </a>
            </div>
          </div>

          {/* 문의 폼(저장) */}
          <InquiryBoard />
        </div>
      </section>

      <Footer />
    </main>
  );
}
