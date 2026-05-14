// app/payment-success/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();
  return (
    <div className="h-[600px] bg-gradient-to-br from-rose-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="bg-white backdrop-blur-lg bg-opacity-60 rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        {/* SVG dấu tick */}
        <svg
          className="w-24 h-24 mx-auto text-green-500 animate-bounce"
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
            d="M9 12l2 2 4-4"
          />
        </svg>

        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
          Thanh toán thành công!
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Cảm ơn bạn! Sushi đang được chuẩn bị, sẽ sớm đến tay bạn 🍣
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-500 hover:from-teal-500 hover:to-green-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
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
