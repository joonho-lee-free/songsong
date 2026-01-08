// app/page.tsx
import type { Metadata } from "next";
import HomeClient from "./_sections/HomeClient";

export const metadata: Metadata = {
  title: "이가에프엔비 업소용 순살닭꼬치 도매 납품",
  description:
    "가게 운영 사장님 전용 업소용 순살닭꼬치 도매 납품. 110g 균일 · 순살 · 냉동 · 박스단위 공급.",
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
  const sp: SearchParams =
    searchParams && typeof (searchParams as any)?.then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : ((searchParams as SearchParams) ?? {});

  return <HomeClient searchParams={sp} />;
}
