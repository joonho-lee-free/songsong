"use client";

import { useMemo, useState } from "react";

type FormState = {
  company: string;
  name: string;
  phone: string;
  message: string;
  isSecret: boolean;
  secretPw: string;
  honeypot: string; // 스팸 방지용(사람은 비워둠)
};

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

  const phoneDigits = useMemo(() => form.phone.replace(/\D/g, ""), [form.phone]);
  const canSubmit = useMemo(() => {
    if (form.honeypot.trim().length > 0) return false; // 봇 차단
    if (form.name.trim().length < 1) return false;
    if (phoneDigits.length < 9) return false; // 최소 길이(유연)
    if (form.isSecret && form.secretPw.trim().length < 4) return false; // 비밀글 비번 최소 4자리
    return true;
  }, [form.honeypot, form.isSecret, form.name, form.secretPw, phoneDigits.length]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // TODO: 다음 단계에서 Firestore / CoolSMS / 이메일 중 하나로 실제 저장/알림 연결
    alert(
      form.isSecret
        ? "비밀 문의가 접수되었습니다. (저장/알림 연동은 다음 단계에서 연결합니다)"
        : "문의가 접수되었습니다. (저장/알림 연동은 다음 단계에서 연결합니다)"
    );

    setForm({
      company: "",
      name: "",
      phone: "",
      message: "",
      isSecret: false,
      secretPw: "",
      honeypot: "",
    });
  }

  return (
    <>
      {/* 예전 앵커 호환용(필요하면 다른 곳에서 scrollToId("sms-lead")로도 이동 가능) */}
      <div id="sms-lead" />

      <div
        id="inquiry"
        className="rounded-2xl border border-gray-900 bg-gray-50 p-6 md:p-8"
      >
        <h2 className="text-lg font-bold md:text-xl">
          📩 문의게시판 (담당자가 직접 연락드립니다)
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          전화가 어려우시면 아래에 남겨주세요.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          {/* honeypot: 봇은 채우고 사람은 보통 안 보임 */}
          <div className="hidden">
            <label className="text-xs text-gray-600">Leave this empty</label>
            <input
              value={form.honeypot}
              onChange={(e) => update("honeypot", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
          </div>

          <input
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="업체명 / 상호명"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />

          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="담당자 성함 (필수)"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />

          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="연락처 (필수)"
            required
            inputMode="tel"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />

          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="문의 내용 (선택)"
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />

          {/* ✅ 비밀글 토글 */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <input
                type="checkbox"
                checked={form.isSecret}
                onChange={(e) => update("isSecret", e.target.checked)}
                className="h-4 w-4"
              />
              비밀글로 작성
            </label>
            <span className="text-xs text-gray-500">체크 시 비밀번호가 필요합니다</span>
          </div>

          {/* ✅ 비밀글 비밀번호 */}
          {form.isSecret && (
            <div className="grid gap-2">
              <input
                type="password"
                value={form.secretPw}
                onChange={(e) => update("secretPw", e.target.value)}
                placeholder="비밀글 비밀번호 (최소 4자리)"
                required
                minLength={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
              <p className="text-xs text-gray-500">
                ※ 비밀번호는 문의 내용 확인/관리 시 필요합니다. 잊지 않게 보관해 주세요.
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500">
            ※ 문의 남기시면 영업시간 내 담당자가 연락드립니다.
          </p>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            문의 남기기
          </button>
        </form>
      </div>
    </>
  );
}
