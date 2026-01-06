// app/_components/InquiryBoard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

type InquiryDoc = {
  company: string;
  name: string;
  phoneMasked: string; // 공개용 마스킹
  phoneLast4: string; // 공개용
  message: string;
  isSecret: boolean;
  secretPwHash?: string; // 비밀글 비번 해시(SHA-256)
  createdAt?: Timestamp;
  status: "new" | "done";
};

type InquiryItem = InquiryDoc & { id: string };

type FormState = {
  company: string;
  name: string;
  phone: string;
  message: string;
  isSecret: boolean;
  secretPw: string;
  honeypot: string; // 스팸 방지(사람은 비워둠)
};

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  // 최소 8자리 이상이면 중간 마스킹, 아니면 대충 마스킹
  if (digits.length >= 9) {
    const head = digits.slice(0, 3);
    return {
      phoneMasked: `${head}-****-${last4.padStart(4, "*")}`,
      phoneLast4: last4,
    };
  }
  return {
    phoneMasked: `***-****-${last4.padStart(4, "*")}`,
    phoneLast4: last4,
  };
}

function formatDate(ts?: Timestamp) {
  if (!ts) return "";
  const d = ts.toDate();
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yy}-${mm}-${dd} ${hh}:${mi}`;
}

async function sha256Base64(input: string) {
  const enc = new TextEncoder().encode(input);
  const hashBuf = await crypto.subtle.digest("SHA-256", enc);
  const bytes = new Uint8Array(hashBuf);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export default function InquiryBoard() {
  const [form, setForm] = useState<FormState>({
    company: "",
    name: "",
    phone: "",
    message: "",
    isSecret: false,
    secretPw: "",
    honeypot: "",
  });

  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  // 보기 모달
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<InquiryItem | null>(null);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // 목록 구독
  useEffect(() => {
    const q = query(
      collection(db, "inquiries"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: InquiryItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as InquiryDoc),
        }));
        setItems(next);
        setLoadingList(false);
      },
      (err) => {
        console.error(err);
        setLoadingList(false);
      }
    );

    return () => unsub();
  }, []);

  const canSubmit = useMemo(() => {
    if (form.honeypot.trim().length > 0) return false;
    if (!form.name.trim()) return false;
    if (!form.phone.trim()) return false;
    if (!form.message.trim()) return false;
    if (form.isSecret && form.secretPw.trim().length < 4) return false;
    return true;
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setSubmitErr(null);
    setSubmitMsg(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitErr(null);
    setSubmitMsg(null);

    // 스팸 방지(허니팟) - 값이 있으면 조용히 무시
    if (form.honeypot.trim().length > 0) return;

    // 간단 검증
    if (!form.name.trim()) return setSubmitErr("이름을 입력해주세요.");
    if (!form.phone.trim()) return setSubmitErr("연락처를 입력해주세요.");
    if (!form.message.trim()) return setSubmitErr("문의 내용을 입력해주세요.");
    if (form.isSecret && form.secretPw.trim().length < 4) {
      return setSubmitErr("비밀글 비밀번호는 4자리 이상 입력해주세요.");
    }

    setSubmitting(true);
    try {
      const { phoneMasked, phoneLast4 } = maskPhone(form.phone);

      const payload: InquiryDoc = {
        company: form.company.trim(),
        name: form.name.trim(),
        phoneMasked,
        phoneLast4,
        message: form.message.trim(),
        isSecret: form.isSecret,
        status: "new",
        createdAt: serverTimestamp() as unknown as Timestamp,
      };

      // 비밀글이면 비번 해시 저장(평문 저장 X)
      if (form.isSecret) {
        payload.secretPwHash = await sha256Base64(form.secretPw.trim());
      }

      await addDoc(collection(db, "inquiries"), payload);

      setSubmitMsg("문의가 등록되었습니다. (목록에 바로 표시됩니다)");
      setForm({
        company: "",
        name: "",
        phone: "",
        message: "",
        isSecret: false,
        secretPw: "",
        honeypot: "",
      });
    } catch (err) {
      console.error(err);
      setSubmitErr("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  function openItem(it: InquiryItem) {
    setSelected(it);
    setOpen(true);
    setPw("");
    setPwErr(null);
    setUnlocked(!it.isSecret); // 공개글은 바로 열림
  }

  function closeModal() {
    setOpen(false);
    setSelected(null);
    setPw("");
    setPwErr(null);
    setUnlocked(false);
  }

  async function verifySecret() {
    setPwErr(null);
    if (!selected) return;
    if (!pw.trim()) return setPwErr("비밀번호를 입력해주세요.");
    if (!selected.secretPwHash) return setPwErr("비밀번호 정보가 없습니다.");

    const hash = await sha256Base64(pw.trim());
    if (hash !== selected.secretPwHash) {
      setPwErr("비밀번호가 일치하지 않습니다.");
      return;
    }
    setUnlocked(true);
  }

  return (
    <section id="inquiry" className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">1:1 문의</h2>
            <p className="mt-1 text-sm text-gray-600">
              궁금한 사항을 문의해주시면 빠르게 답변드리겠습니다.
            </p>
            <p className="text-xs text-gray-500">
              ※ 비밀글은 비밀번호가 맞는 경우에만 내용이 보입니다.
            </p>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          {/* honeypot */}
          <input
            type="text"
            value={form.honeypot}
            onChange={(e) => update("honeypot", e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-800">
                업체명(선택)
              </label>
              <input
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="예) ○○식당"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                담당자명 <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="예) 홍길동"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="예) 010-1234-5678"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">
                ※ 공개 목록에는 마스킹 처리되어 표시됩니다.
              </p>
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={form.isSecret}
                  onChange={(e) => update("isSecret", e.target.checked)}
                  className="h-4 w-4"
                />
                비밀글로 작성
              </label>

              {form.isSecret ? (
                <input
                  value={form.secretPw}
                  onChange={(e) => update("secretPw", e.target.value)}
                  placeholder="비밀번호(4자리 이상)"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
              ) : (
                <div className="h-[46px]" />
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-800">
              문의 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="원하시는 품목/수량/납품지역/희망일정 등을 적어주세요."
              rows={5}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            {submitErr ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitErr}
              </div>
            ) : null}

            {submitMsg ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {submitMsg}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "저장 중..." : "문의 남기기"}
            </button>
          </div>
        </form>

        {/* 목록 */}
        <div className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-base font-extrabold text-gray-900">문의 목록</h3>
            <p className="text-xs text-gray-500">최신 20건 표시</p>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-bold text-gray-700">
              <div className="col-span-7">제목</div>
              <div className="col-span-3 text-center">아이디</div>
              <div className="col-span-2 text-right">날짜</div>
            </div>

            {loadingList ? (
              <div className="px-4 py-6 text-sm text-gray-500">불러오는 중...</div>
            ) : items.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                아직 등록된 문의가 없습니다.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((it) => {
                  const title = it.isSecret
                    ? "🔒 비밀글입니다"
                    : it.message.length > 30
                    ? it.message.slice(0, 30) + "..."
                    : it.message;

                  const writer =
                    (it.name?.trim()?.[0] ?? "*") + "***" + (it.phoneLast4 ? it.phoneLast4 : "");

                  return (
                    <li
                      key={it.id}
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50"
                      onClick={() => openItem(it)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="grid grid-cols-12 items-center gap-2">
                        <div className="col-span-7 text-sm font-semibold text-gray-900">
                          {title}
                          {it.status === "done" ? (
                            <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                              답변 완료
                            </span>
                          ) : null}
                        </div>
                        <div className="col-span-3 text-center text-xs text-gray-600">
                          {writer}
                        </div>
                        <div className="col-span-2 text-right text-xs text-gray-500">
                          {formatDate(it.createdAt)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {open && selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-extrabold text-gray-900">
                  {selected.isSecret ? "🔒 비밀글" : "문의 내용"}
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  작성자: {selected.name} · {selected.phoneMasked} ·{" "}
                  {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              {selected.isSecret && !unlocked ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    비밀글입니다. 비밀번호를 입력하면 내용을 확인할 수 있습니다.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      placeholder="비밀번호"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                    />
                    <button
                      onClick={verifySecret}
                      className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white"
                    >
                      확인
                    </button>
                  </div>
                  {pwErr ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {pwErr}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-2">
                  {selected.company ? (
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">업체명:</span> {selected.company}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {selected.message}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              ※ 운영 안정화를 위해 “비밀글(연락처/민감내용)”은 서버검증 방식(API)으로
              강화하는 것을 권장합니다. (원하면 다음 단계로 바로 바꿔드릴게요)
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
