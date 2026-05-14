"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const email = searchParams.get("email");
      const res = await axios.post("http://127.0.0.1:8000/api/reset-password", {
        token,
        password,
        email,
        password_confirmation: confirmPassword,
      });
      setMessage("Mật khẩu đã được đặt lại thành công.");
    } catch (err: any) {
      setError("Token không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F1E9]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#333333] mb-6">
          Đặt lại mật khẩu
        </h1>
        <form onSubmit={handleReset}>
          <label className="block mb-1 text-sm font-medium text-[#333333]">
            Mật khẩu mới:
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md mb-4 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="block mb-1 text-sm font-medium text-[#333333]">
            Xác nhận mật khẩu:
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-[#E8D5C4] rounded-md mb-4 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#AF763E] text-white py-2 rounded-md hover:bg-[#BD944A]"
          >
            Đặt lại mật khẩu
          </button>
        </form>
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
