"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../context/authContext";
import Cookies from "js-cookie";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8F1E9] flex items-center justify-center">
      <div className="text-center text-red-600">
        <p className="text-lg font-medium">
          Có lỗi xảy ra khi xử lý đăng nhập Google
        </p>
        <p className="text-sm mt-2">{error.message}</p>
        <button
          onClick={() => {
            resetErrorBoundary();
            window.location.href = "/dang-nhap";
          }}
          className="mt-4 px-4 py-2 bg-[#AF763E] text-white rounded hover:bg-[#BD944A] transition-colors"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    </div>
  );
}

function GoogleCallbackContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        console.error("Google auth error:", error);
        let errorMessage = "Đăng nhập Google thất bại";

        if (error === "access_denied") {
          errorMessage = "Bạn đã từ chối quyền truy cập Google";
        } else if (error === "google_auth_failed") {
          errorMessage = "Xác thực Google không thành công";
        } else if (error === "invalid_token") {
          errorMessage = "Token không hợp lệ";
        }

        router.push(`/dang-nhap?error=${encodeURIComponent(errorMessage)}`);
        return;
      }

      if (token) {
        try {
          const cookieOptions = {
            expires: 7,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
          };
          Cookies.set("access_token", token, cookieOptions);
          await login(token);

          const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
          if (redirectUrl && redirectUrl !== "/dang-nhap") {
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectUrl);
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Error processing Google login:", error);
          router.push(
            `/dang-nhap?error=${encodeURIComponent(
              "Có lỗi xảy ra khi đăng nhập"
            )}`
          );
        }
      } else {
        router.push(
          `/dang-nhap?error=${encodeURIComponent(
            "Không nhận được thông tin đăng nhập"
          )}`
        );
      }
    };

    // Add timeout for the callback process
    const timer = setTimeout(() => {
      if (!searchParams.get("token") && !searchParams.get("error")) {
        router.push(
          `/dang-nhap?error=${encodeURIComponent(
            "Quá trình đăng nhập mất quá nhiều thời gian"
          )}`
        );
      }
    }, 30000); // 30 seconds timeout

    handleCallback();
    return () => clearTimeout(timer);
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen bg-[#F8F1E9] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF763E] mx-auto"></div>
        <p className="mt-4 text-[#666666]">Đang xử lý đăng nhập Google...</p>
        <p className="mt-2 text-sm text-[#888888]">
          Vui lòng chờ trong giây lát
        </p>
      </div>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F1E9] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF763E] mx-auto"></div>
            <p className="mt-4 text-[#666666]">Đang tải...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
