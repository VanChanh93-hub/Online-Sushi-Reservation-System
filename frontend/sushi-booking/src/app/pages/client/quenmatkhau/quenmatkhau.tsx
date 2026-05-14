"use client";

import { useState } from "react";
import axios from "axios";
import { FiMail, FiLock, FiKey, FiArrowLeft } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/forgot-password", { email });
      setMessage("Mã xác thực đã được gửi đến email của bạn.");
      setStep("verify");
    } catch (err) {
      setError("Không thể gửi email. Vui lòng kiểm tra lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/reset-password", {
        email,
        code,
        password: newPassword,
      });
      setMessage("Đặt lại mật khẩu thành công!");
      setCode("");
      setNewPassword("");
    } catch (err) {
      setError("Mã xác thực không đúng hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRequest = () => {
    setStep("request");
    setError("");
    setMessage("");
  };

  return (
    <div className="relative py-[60px] flex items-center justify-center bg-[#F8F1E9] overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#AF763E] opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#BD944A] opacity-10 rounded-full blur-2xl animate-spin-slow" />
        <div className="absolute top-1/3 left-1/2 w-[200px] h-[200px] bg-[#E8D5C4] opacity-10 rounded-full blur-2xl" />
      </div>

      {/* Floating sushi icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="animate-float absolute top-10 left-10 text-4xl">🍣</div>
        <div className="animate-float-slow absolute bottom-20 right-10 text-3xl">
          🍤
        </div>
        <div className="animate-float delay-500 absolute top-1/3 right-20 text-5xl">
          🥢
        </div>
        <div className="animate-float-fast absolute bottom-10 left-1/4 text-4xl">
          🍙
        </div>
      </div>

      {/* Content Card */}
      <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#E8D5C4] z-10">
        <div className="flex items-center mb-6">
          {step === "verify" && (
            <button
              onClick={handleBackToRequest}
              className="mr-2 p-2 rounded-full hover:bg-[#F8F1E9]"
              aria-label="Quay lại"
            >
              <FiArrowLeft className="text-[#AF763E]" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-[#333333]">
            {step === "request" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
          </h1>
        </div>

        <p className="text-sm text-[#666666] mb-6">
          {step === "request"
            ? "Nhập email đăng ký tài khoản để nhận mã xác thực"
            : "Nhập mã xác thực và mật khẩu mới"}
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <InputWithIcon
              icon={<FiMail className="text-[#AF763E]" />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              label="Email"
              required
            />
            <SubmitButton isLoading={isLoading} text="Gửi mã xác thực" />
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <InputWithIcon
              icon={<FiKey className="text-[#AF763E]" />}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Nhập mã xác thực"
              label="Mã xác thực"
              required
            />
            <InputWithIcon
              icon={<FiLock className="text-[#AF763E]" />}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ít nhất 8 ký tự"
              label="Mật khẩu mới"
              required
              minLength={8}
            />
            <SubmitButton isLoading={isLoading} text="Đặt lại mật khẩu" />
          </form>
        )}
      </div>
    </div>
  );
}

// Input component
function InputWithIcon({
  icon,
  type,
  value,
  onChange,
  placeholder,
  label,
  required,
  minLength,
}: {
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
  label: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#555555] mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          className="w-full pl-10 pr-4 py-3 border border-[#E8D5C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF763E] focus:border-transparent transition-all"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
        />
      </div>
    </div>
  );
}

// Button loading state
function SubmitButton({
  isLoading,
  text,
}: {
  isLoading: boolean;
  text: string;
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
        isLoading
          ? "bg-[#BD944A] cursor-not-allowed"
          : "bg-[#AF763E] hover:bg-[#BD944A]"
      } transition-colors flex items-center justify-center`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Đang xử lý...
        </>
      ) : (
        text
      )}
    </button>
  );
}
