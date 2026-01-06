import type { Metadata } from "next";
import Hero from "./_components/Hero";
import InquiryBoard from "./_components/InquiryBoard";

export const metadata: Metadata = {
  title: "사장님 전용 닭꼬치 도매 납품 | 이가에프엔비",
  description:
    "HACCP 공장직영 닭꼬치. 업소 운영 사장님 전용 B2B 납품. 발주GO로 간편 주문 · 안정적 배송.",
};

const KAKAO_CHAT_URL = "https://pf.kakao.com/___YOUR_CHANNEL/chat"; // TODO: 실제 링크
const CALL_PHONE = "051-714-3396"; // TODO: 실제 번호
const HERO_IMAGE_SRC = "/images/hero-a.png";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* 1️⃣ Hero */}
      <Hero
        kakaoChatUrl={KAKAO_CHAT_URL}
        callPhone={CALL_PHONE}
        heroImageSrc={HERO_IMAGE_SRC}
      />

      {/* 본문 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-40 md:px-8">
        <div className="grid gap-10">
          {/* 이런 사장님께 맞습니다 */}
          <div className="rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold md:text-xl">이런 사장님께 맞습니다</h2>
            <ul className="mt-4 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
              <li>✔ 닭꼬치 전문점 / 포장마차 / 호프집</li>
              <li>✔ 푸드트럭 / 야시장 / 행사 운영</li>
              <li>✔ 프랜차이즈 가맹점</li>
              <li>✔ 안정적인 납품처가 필요한 업소</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              ※ 개인 소비자 판매가 아닌 <b>사업자 전용 납품</b>입니다.
            </p>
          </div>

          {/* 왜 이가에프엔비인가 */}
          <div className="rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold md:text-xl">왜 이가에프엔비인가</h2>
            <ul className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-2">
              <li>✔ HACCP 인증 공장 직접 생산</li>
              <li>✔ 유통단계 최소화 → 진짜 B2B 단가</li>
              <li>✔ 실생산 · 실포장 현장 운영</li>
              <li>✔ 문제 발생 시 교환·환불 기준 명확</li>
            </ul>
          </div>

          {/* 제품 구성 */}
          <div className="rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold md:text-xl">제품 구성</h2>
            <p className="mt-2 text-sm text-gray-600">
              업소 운영에 가장 많이 사용되는 닭꼬치 위주 구성
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-gray-700 md:grid-cols-3">
              <li>• 왕순살 / 왕파닭</li>
              <li>• 일본식 순살 / 일본식 파닭</li>
              <li>• 염통 / 닭껍질</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              ※ 전 제품 <b>박스 단위 · B2B 납품 전용</b>
            </p>
          </div>

          {/* 발주GO 강조 */}
          <div className="rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold md:text-xl">발주GO로 주문이 편합니다</h2>
            <ul className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-2">
              <li>✔ 모바일 / 앱으로 언제든 주문</li>
              <li>✔ 품목·수량 한눈에 확인</li>
              <li>✔ 전용계좌 충전 후 즉시 주문</li>
              <li>✔ 주문·배송 내역 자동 관리</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              전화·카톡 주문 없이도 안정적으로 발주 가능합니다.
            </p>
          </div>

          {/* 주문 흐름 */}
          <div className="rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold md:text-xl">주문 진행 순서</h2>
            <ol className="mt-4 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
              <li>1️⃣ 문의 접수</li>
              <li>2️⃣ 발주GO 계정 발급</li>
              <li>3️⃣ 충전 후 주문</li>
              <li>4️⃣ 출고 · 배송</li>
            </ol>
            <p className="mt-3 text-sm text-gray-500">
              ※ 첫 거래 시 담당자가 직접 안내드립니다.
            </p>
          </div>

          {/* ⭐ 문의게시판(비밀글 지원) */}
          <InquiryBoard />
        </div>
      </section>

      {/* 모바일 하단 고정 CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-3 py-3">
          <a
            href={`tel:${CALL_PHONE.replaceAll("-", "")}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
          >
            📞 전화
          </a>
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900"
          >
            💬 카톡
          </a>
        </div>
      </div>
    </main>
  );
}
