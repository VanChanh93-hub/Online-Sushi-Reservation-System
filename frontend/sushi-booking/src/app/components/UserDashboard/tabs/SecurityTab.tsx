import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Key, Lock } from "lucide-react";

export default function SecurityTab() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
  });
  const [step, setStep] = useState<"request" | "reset">("request");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/forgot-password", {
        email: form.email,
      });
      setMessage("Mã xác thực đã được gửi về email của bạn.");
      setStep("reset");
    } catch (err) {
      setError("Không thể gửi mã xác thực. Vui lòng kiểm tra lại email.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/reset-password", form);
      setMessage("Đặt lại mật khẩu thành công!");
    } catch (err) {
      setError("Mã xác thực không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-wooden-light rounded-xl shadow-lg border border-wooden">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#AF763E] mb-2">
          Đặt lại mật khẩu
        </h2>
        <p className="text-gray-600">
          Vui lòng nhập email để nhận mã xác thực đặt lại mật khẩu
        </p>
      </div>

      <form
        onSubmit={step === "request" ? requestOtp : resetPassword}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#AF763E] flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Địa chỉ email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-wooden px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AF763E] bg-white/90"
            placeholder="Nhập email của bạn"
          />
        </div>

        {step === "reset" && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#AF763E] flex items-center gap-2">
                <Key className="w-4 h-4" />
                Mã xác thực
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-wooden px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AF763E] bg-white/90"
                placeholder="Nhập mã từ email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#AF763E] flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-wooden px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AF763E] bg-white/90"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`w-full text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#AF763E] focus:ring-offset-2 shadow-md transition ${
            isLoading ? "bg-[#AF763E]/80" : "bg-[#AF763E] hover:bg-[#AF763E]/90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
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
            </span>
          ) : step === "request" ? (
            "Gửi mã xác thực"
          ) : (
            "Đặt lại mật khẩu"
          )}
        </motion.button>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-200"
          >
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200"
          >
            {error}
          </motion.div>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-wooden-light text-center text-sm text-gray-500">
        <p>Nếu cần trợ giúp, vui lòng liên hệ bộ phận chăm sóc khách hàng</p>
      </div>
    </div>
  );
}
