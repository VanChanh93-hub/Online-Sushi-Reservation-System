"use client";

import type React from "react";
import { useAuth } from "../../../context/authContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../../lib/i18n/client";

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string | number;
    name: string;
    email: string;
  };
}

export default function LoginPage() {
  const { t, lang } = useTranslation("loginPage");
  const { login, logout, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Xử lý error từ URL (Google callback errors)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam) {
      setErrors({ general: decodeURIComponent(errorParam) });
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Tự động login nếu cookie có token
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token && !user && !authLoading) {
      login(token).catch((error) => {
        console.error("Auto-login failed:", error);
        // Token invalid, remove it
        Cookies.remove("access_token");
      });
    }
  }, [login, user, authLoading]);

  const validate = (): boolean => {
    const newErr: Errors = {};
    if (!email) {
      newErr.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErr.email = "Email không hợp lệ";
    }
    if (!password) {
      newErr.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErr.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post<LoginResponse>(
        "http://127.0.0.1:8000/api/login",
        {
          email,
          password,
        }
      );

      const token = res.data.access_token;

      // Lưu token vào cookie
      const cookieOptions = {
        expires: rememberMe ? 30 : 7, // 30 days if remember me, otherwise 7 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      };
      Cookies.set("access_token", token, cookieOptions);

      // Gọi login context
      await login(token);

      // Redirect will happen automatically via useEffect
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setErrors({ general: "Email hoặc mật khẩu không chính xác" });
      } else if (error.response?.status === 422) {
        setErrors({ general: "Dữ liệu không hợp lệ" });
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Đăng nhập thất bại. Vui lòng thử lại." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Save current page to redirect back after login
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = "http://127.0.0.1:8000/api/auth/google/redirect";
  };

  const handleLogout = async () => {
    try {
      Cookies.remove("access_token");
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-red-100 max-w-md w-full mx-4">
          {/* Decorative top border */}
          <div className="h-1 bg-gradient-to-r from-red-500 to-amber-500 mb-6"></div>

          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Animated spinner with sushi theme */}
            <div className="relative w-20 h-20">
              <svg
                className="animate-spin w-full h-full text-[#AF763E]"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {/* Sushi icon in the center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#EF4444]"
                >
                  <path
                    d="M12 12C12 14.7614 9.76142 17 7 17C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7C9.76142 7 12 9.23858 12 12Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#333333]">{t("title")}</h2>
            <p className="text-[#5F3E1B]">Vui lòng chờ trong giây lát...</p>

            {/* Progress bar for better UX */}
            <div className="w-full bg-red-100 rounded-full h-2.5 mt-4">
              <div
                className="bg-gradient-to-r from-[#AF763E] to-[#BD944A] h-2.5 rounded-full animate-pulse"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>

          {/* Decorative bottom border */}
          <div className="h-1 bg-gradient-to-r from-amber-500 to-red-500 mt-6"></div>
        </div>
      </div>
    );
  }

  // Don't render if user is already logged in (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50">
      {/* Sushi decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 12C12 14.7614 9.76142 17 7 17C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7C9.76142 7 12 9.23858 12 12Z"
            fill="#EF4444"
          />
          <path
            d="M22 12C22 14.7614 19.7614 17 17 17C14.2386 17 12 14.7614 12 12C12 9.23858 14.2386 7 17 7C19.7614 7 22 9.23858 22 12Z"
            fill="#EF4444"
          />
        </svg>
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 7C9.76142 7 12 9.23858 12 12C12 14.7614 9.76142 17 7 17C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7Z"
            fill="#F59E0B"
          />
          <path
            d="M17 7C19.7614 7 22 9.23858 22 12C22 14.7614 19.7614 17 17 17C14.2386 17 12 14.7614 12 12C12 9.23858 14.2386 7 17 7Z"
            fill="#F59E0B"
          />
        </svg>
      </div>

      {/* Login Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Logo Sushi */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#333333] mb-2">
              {t("title")}
            </h1>
            <p className="text-[#333333]">{t("description")}</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-red-100">
            {/* Decorative top border */}
            <div className="h-1 bg-gradient-to-r from-red-500 to-amber-500"></div>

            <div className="p-8">
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#333333] mb-1"
                  >
                    {t("email")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-red-200"
                      }`}
                      placeholder="email@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-[#AF763E]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#333333]"
                    >
                      {t("password")}
                    </label>
                    <Link
                      href="/quen-mat-khau"
                      className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      {t("forgot")}
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-red-200"
                      }`}
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-[#AF763E]">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#AF763E] focus:ring-red-500 border-red-300 rounded"
                    disabled={loading}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-red-800"
                  >
                    {t("remember")}
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#AF763E] hover:bg-[#BD944A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Đang đăng nhập...
                      </span>
                    ) : (
                      t("loginButton")
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-red-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-red-800">
                      {t("or")}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-[#333333] bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 border border-red-200 transition-colors disabled:opacity-50"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                    </svg>
                    <span>{t("google")}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-red-50 text-center">
              <p className="text-sm text-red-800">
                {t("dontHaveAccount")}
                <Link
                  href={`/${lang}/dang-ky`}
                  className="font-medium text-amber-700 hover:text-amber-800"
                >
                  {t("register")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
