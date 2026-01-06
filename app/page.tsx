// 파일위치: app/page.tsx
// 파일명: page.tsx

import type { Metadata } from "next";
import Hero from "./_components/Hero";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "이가에프엔비 업소용 순살닭꼬치 도매 납품",
  description:
    "가게 운영 사장님 전용 업소용 순살닭꼬치 도매 납품. 110g 균일 · 순살 · 냉동 · 박스단위 공급.",
};

const KAKAO_CHAT_URL = "https://pf.kakao.com/___YOUR_CHANNEL/chat"; // TODO 실제 채널로 교체
const CALL_PHONE = "010-0000-0000"; // TODO 실제 번호로 교체
const HERO_IMAGE_SRC = "/images/hero-a.png";

type SearchParams = {
  sent?: string;
  error?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  // Next.js 16+ 대응: searchParams가 Promise일 수 있음
  const sp: SearchParams =
    searchParams && typeof (searchParams as any)?.then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : ((searchParams as SearchParams) ?? {});

  const sent = sp.sent === "1";
  const error = sp.error;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <Hero
        kakaoChatUrl={KAKAO_CHAT_URL}
        callPhone={CALL_PHONE}
        heroImageSrc={HERO_IMAGE_SRC}
        leadAnchorId="sms-lead"
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

        </div>
      </section>


      {/* 문자 상담 요청 폼 */}
      <section
        id="sms-lead"
        className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-8"
      >
        <div className="rounded-2xl border border-gray-200 p-5 md:p-7">
          <h2 className="text-lg font-bold md:text-xl">문자 상담 요청</h2>
          <p className="mt-2 text-sm text-gray-600">
            아래 내용을 제출하면 담당자 휴대폰으로 문자로 바로 접수됩니다.
          </p>

          {/* 결과 메시지 */}
          {sent && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              접수 완료! 곧 연락드릴게요 🙂
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              접수에 실패했어요. 잠시 후 다시 시도해주세요. (error: {error})
            </div>
          )}

          <form action="/api/sms-lead" method="post" className="mt-5 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium">상호(가게명)</span>
                <input
                  name="storeName"
                  required
                  maxLength={40}
                  className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="예) 송송꼬치"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-medium">연락처</span>
                <input
                  name="phone"
                  required
                  inputMode="numeric"
                  className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="01012345678 (하이픈 없이)"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">요청 내용</span>
              <textarea
                name="message"
                maxLength={300}
                rows={4}
                className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="예) 110g 10박스, 부산/냉동, 단가와 배송 조건 문의"
              />
            </label>

            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="consent"
                value="1"
                required
                className="mt-1"
              />
              <span>
                개인정보 수집·이용에 동의합니다. (상호/연락처/문의내용, 상담 목적)
              </span>
            </label>

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:opacity-80"
            >
              문자로 접수하기
            </button>

            <p className="text-xs text-gray-500">
              * 스팸 방지를 위해 과도한 연속 접수는 제한될 수 있습니다.
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
