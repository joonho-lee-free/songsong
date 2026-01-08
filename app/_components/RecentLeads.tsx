"use client";

import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

type Lead = {
  id: string;
  displayName: string;
  displayPhone?: string;
  displayRegion?: string;
  inquiryType: string;
  createdAt?: Timestamp;
};

function timeAgo(ts?: Timestamp) {
  if (!ts) return "";
  const diff = Date.now() - ts.toDate().getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}

export default function RecentLeads() {
  const [items, setItems] = useState<Lead[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "public_leads"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Lead[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setItems(list);
      },
      (err) => console.error("RecentLeads snapshot error:", err)
    );

    return () => unsub();
  }, []);

  if (!items.length) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-7">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold md:text-xl">최근 문의</h3>
          <span className="text-xs text-gray-500">
            비식별 처리(상호/연락처) + 유형만 표시
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
          {/* 헤더 */}
          <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">
            <div className="col-span-2">성명</div>
            <div className="col-span-3">연락처</div>
            <div className="col-span-2">지역</div>
            <div className="col-span-3">문의내용</div>
            <div className="col-span-2 text-right">시간</div>
          </div>

          {/* 바디 */}
          <ul className="divide-y divide-gray-200">
            {items.map((it) => (
              <li key={it.id} className="grid grid-cols-12 px-4 py-2 text-sm">
                <div className="col-span-2 font-medium">{it.displayName}</div>
                <div className="col-span-3 text-gray-700">
                  {it.displayPhone ?? "-"}
                </div>
                <div className="col-span-2 text-gray-700">
                  {it.displayRegion ?? "미정"}
                </div>
                <div className="col-span-3 text-gray-700">{it.inquiryType}</div>
                <div className="col-span-2 text-right text-xs text-gray-500">
                  {timeAgo(it.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-2 text-xs text-gray-400">
          * 지역은 메시지 내 키워드(예: 부산/서울/경기 등)로 자동 추정되며, 원문은 저장/노출하지 않습니다.
        </p>
      </div>
    </section>
  );
}
