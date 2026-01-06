// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "업소용 순살닭꼬치 도매 납품",
  description:
    "가게 운영 사장님 전용 업소용 순살닭꼬치 도매 납품. 110g 균일 · 순살 · 냉동 · 박스단위 공급.",
};

const KAKAO_CHAT_URL = "https://pf.kakao.com/___YOUR_CHANNEL/chat"; // TODO: 카톡 채널/링크로 교체
const CALL_PHONE = "010-0000-0000"; // TODO: 실제 번호로 교체 (하이픈 포함/미포함 상관없음)
const HERO_IMAGE_SRC = "/images/hero-a.png"; // TODO: public/images/hero-a.png 로 넣기

export default function LandingPage({
  searchParams,
}: {
  searchParams?: { sent?: string; error?: string };
}) {
  const sent = searchParams?.sent === "1";
  const error = searchParams?.error;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-8 md:px-8 md:pt-16 md:pb-12">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
          {/* Left: Copy + CTA */}
          <div>
            <p className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">
              가게 운영 사장님 전용
            </p>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              업소용 순살닭꼬치 <span className="whitespace-nowrap">도매 납품</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg">
              <span className="font-semibold text-gray-900">
                110g 균일 · 순살 · 냉동 · 박스단위 공급
              </span>
              <br />
              <span className="text-gray-600">
                대량 발주 시 배송 혜택 제공 (도매 거래 기준, 조건별 안내)
              </span>
            </p>

            {/* CTA 3개 */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <a
                href={`tel:${CALL_PHONE.replaceAll("-", "")}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:opacity-80"
                aria-label="전화로 도매 단가 바로 받기"
              >
                <span aria-hidden>📞</span>
                전화로 단가 받기
              </a>

              <a
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 active:bg-gray-100"
                aria-label="카톡으로 도매 조건 문의"
              >
                <span aria-hidden>💬</span>
                카톡 문의
              </a>

              {/* 서버컴포넌트에서도 안전하게 동작: 앵커 이동 */}
              <a
                href="#sms-lead"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 active:bg-gray-100"
                aria-label="문자로 도매 상담 요청하기(폼으로 이동)"
              >
                <span aria-hidden>✉️</span>
                문자요청
              </a>
            </div>

            {/* “소비자 문의 차단” 보조 문구 */}
            <p className="mt-4 text-sm text-gray-600">
              ※ 본 페이지는 <span className="font-semibold">업소 납품/도매</span> 전용입니다.
            </p>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
              <img
                src={HERO_IMAGE_SRC}
                alt="업소용 순살닭꼬치 도매 납품 제품 이미지"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-8">
        <div className="grid gap-8">
          <div className="rounded-2xl border border-gray-200 p-5 md:p-7">
            <h2 className="text-lg font-bold md:text-xl">이런 사장님께 맞습니다</h2>
            <p className="mt-2 text-sm text-gray-600">
              분식 · 포장마차 · 호프/주점 · 푸드트럭 · 야시장 등 업소 운영 사장님 대상
            </p>
          </div>

          {/* 문자 상담 요청 폼 */}
          <div id="sms-lead" className="rounded-2xl border border-gray-200 p-5 md:p-7">
            <h2 className="text-lg font-bold md:text-xl">문자 상담 요청</h2>
            <p className="mt-2 text-sm text-gray-600">
              아래 내용 제출하면 담당자 휴대폰으로 문자로 바로 접수됩니다.
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
                * 스팸 방지를 위해 과도한 연속 접수는 제한될 수 있어요.
              </p>
            </form>
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
