// app/page.tsx
import type { Metadata } from "next";
import HomeClient from "./_sections/HomeClient";

export const metadata: Metadata = {
  // ✅ 메인 키워드(닭꼬치) 중심 타이틀
  title: "닭꼬치 도매·납품 | HACCP 공장직영 순살닭꼬치 - 이가에프엔비",

  // ✅ 검색 결과 설명 (B2B 의도 명확)
  description:
    "닭꼬치 전문 제조·납품 업체 이가에프엔비. HACCP 인증 공장직영으로 순살닭꼬치·꼬치류를 업소용 도매·박스단위로 전국 B2B 납품합니다.",

  // ✅ canonical (중복 URL 방지)
  alternates: {
    canonical: "https://leegafnb.kr/",
  },

  // ✅ 공유(카톡/네이버/페북 등)용 메타
  openGraph: {
    title: "닭꼬치 도매·납품 | HACCP 공장직영 이가에프엔비",
    description:
      "순살닭꼬치·꼬치류 업소용 도매 납품. HACCP 인증 공장직영, 전국 배송.",
    url: "https://leegafnb.kr/",
    siteName: "이가에프엔비",
    type: "website",
    locale: "ko_KR",
  },

  // ✅ 키워드 보강 (검색엔진 신호)
  keywords: [
    "닭꼬치",
    "순살닭꼬치",
    "닭꼬치 도매",
    "닭꼬치 납품",
    "업소용 닭꼬치",
    "닭꼬치 공장",
    "닭꼬치 HACCP",
    "이가에프엔비",
  ],
};

type SearchParams = {
  sent?: string;
  error?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  // ✅ 기존 searchParams 처리 로직 그대로 유지
  const sp: SearchParams =
    searchParams && typeof (searchParams as any)?.then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : ((searchParams as SearchParams) ?? {});

  // ✅ 기존 HomeClient 연결 로직 그대로 유지
  return <HomeClient searchParams={sp} />;
}
