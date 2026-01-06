// app/page.tsx
import type { Metadata } from "next";
import Hero from "./_components/Hero";

export const metadata: Metadata = {
  title: "업소용 순살닭꼬치 도매 납품",
  description:
    "가게 운영 사장님 전용 업소용 순살닭꼬치 도매 납품. 110g 균일 · 순살 · 냉동 · 박스단위 공급.",
};

const KAKAO_CHAT_URL = "https://pf.kakao.com/___YOUR_CHANNEL/chat"; // TODO: 실제 링크로 교체
const CALL_PHONE = "010-0000-0000"; // TODO: 실제 번호로 교체
const HERO_IMAGE_SRC = "/images/hero-a.png"; // public/images/hero-a.png

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Hero kakaoChatUrl={KAKAO_CHAT_URL} callPhone={CALL_PHONE} heroImageSrc={HERO_IMAGE_SRC} />

      {/* 아래는 다음 단계에서 채울 영역(레이아웃 자리만) */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-8">
        <div className="grid gap-8">
          {/* TODO: 2) 이런 사장님께 맞습니다 */}
          <div className="rounded-2xl border border-gray-200 p-5 md:p-7">
            <h2 className="text-lg font-bold md:text-xl">이런 사장님께 맞습니다</h2>
            <p className="mt-2 text-sm text-gray-600">
              분식 · 포장마차 · 호프/주점 · 푸드트럭 · 야시장 등 업소 운영 사장님 대상
            </p>
          </div>

          {/* TODO: 6) 문자 상담 요청 폼 섹션(스크롤 목적지) */}
          <div id="sms-lead" className="rounded-2xl border border-gray-200 p-5 md:p-7">
            <h2 className="text-lg font-bold md:text-xl">문자 상담 요청</h2>
            <p className="mt-2 text-sm text-gray-600">
              (다음 단계에서 폼 UI + CoolSMS 연동을 붙입니다)
            </p>
          </div>
        </div>
      </section>

      {/* 모바일 하단 고정 CTA (전화/카톡) */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-3 py-3">
          <a
            href={`tel:${CALL_PHONE.replaceAll("-", "")}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:opacity-80"
            aria-label="하단 고정: 전화"
          >
            <span aria-hidden>📞</span> 전화
          </a>
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 active:bg-gray-100"
            aria-label="하단 고정: 카톡"
          >
            <span aria-hidden>💬</span> 카톡
          </a>
        </div>
      </div>
    </main>
  );
}
