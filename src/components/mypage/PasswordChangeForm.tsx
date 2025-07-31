"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";

interface PasswordChangeFormProps {
  onClose: () => void;
}

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    // Eye (open)
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
            -1.274 4.057-5.065 7-9.542 7
            -4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ) : (
    // EyeOff (closed)
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7
        a9.957 9.957 0 012.881-4.307M17.654 17.658A9.978 9.978 0 0012 19
        c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.957-4.411M15 12a3 3 0 01-6 0m9.543-3.542l-13 13"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3l18 18"
      />
    </svg>
  );

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const { changePassword } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (newPassword !== newPasswordCheck) {
      setError("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }
    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      alert("비밀번호가 변경되었습니다.");
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || "비밀번호 변경 실패");
    } finally {
      setSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordCheck("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md w-full rounded-2xl border border-purple-900 bg-gradient-to-br from-[#18102a] via-[#25143c] to-[#10081c] p-8 shadow-[0_8px_36px_0_rgba(60,10,90,0.55)] glassmorphism animate-fadein">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-2xl"
          onClick={onClose}
          disabled={saving}
          aria-label="닫기"
        >
          ×
        </button>
        {/* 아이콘 & 제목 */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-full bg-purple-800/40 shadow-inner">
            <span className="text-2xl">🔐</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            비밀번호 변경
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900/80 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600 pr-10"
                placeholder="현재 비밀번호"
                disabled={saving}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-purple-300 p-1"
                tabIndex={-1}
                onClick={() => setShowCurrent((v) => !v)}
                aria-label={showCurrent ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <EyeIcon open={showCurrent} />
              </button>
            </div>
          </div>
          {/* 새 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              새 비밀번호
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900/80 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600 pr-10"
                placeholder="새 비밀번호"
                disabled={saving}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-purple-300 p-1"
                tabIndex={-1}
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <EyeIcon open={showNew} />
              </button>
            </div>
          </div>
          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              새 비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showCheck ? "text" : "password"}
                value={newPasswordCheck}
                onChange={(e) => setNewPasswordCheck(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900/80 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600 pr-10"
                placeholder="새 비밀번호 확인"
                disabled={saving}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-purple-300 p-1"
                tabIndex={-1}
                onClick={() => setShowCheck((v) => !v)}
                aria-label={showCheck ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <EyeIcon open={showCheck} />
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-400 text-center text-sm">{error}</div>
          )}
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="
                w-full bg-gradient-to-r from-purple-600 to-purple-900 
                hover:from-purple-700 hover:to-purple-950
                text-white font-semibold py-2 rounded-lg shadow
                transition-all disabled:opacity-60
              "
              disabled={saving}
            >
              {saving ? "변경 중..." : "비밀번호 변경"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="
                w-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 
                font-semibold py-2 rounded-lg shadow
                transition-all disabled:opacity-60
              "
              disabled={saving}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
