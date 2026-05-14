// app/payment-failed/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const router = useRouter();
  return (
    <div className="h-[600px] bg-gradient-to-br from-rose-100 via-white to-red-50 flex items-center justify-center p-6">
      <div className="bg-white backdrop-blur-lg bg-opacity-60 rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        {/* SVG dấu X */}
        <svg
          className="w-24 h-24 mx-auto text-red-500 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeWidth="2"
            className="opacity-20"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 9l-6 6m0-6l6 6"
          />
        </svg>

        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
          Thanh toán thất bại!
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Rất tiếc! Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử
          lại.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-rose-500 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          <span>Về trang chủ</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Footer gọn gàng phía dưới */}
        <footer className="mt-8 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Sushi House – Tinh hoa ẩm thực Nhật
        </footer>
      </div>
    </div>
  );
}
