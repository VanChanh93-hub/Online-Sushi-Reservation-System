"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import axios, { AxiosError } from "axios";
import confetti from "canvas-confetti";
import Confetti from "react-confetti";
import { useAuth } from "../../context/authContext";
import NotificationPopup from "../layout/NotificationPopup";

interface Voucher {
  id: number;
  code: string;
  discount_value: number;
  status?: string;
}

export default function LuckyWheel() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [displayVouchers, setDisplayVouchers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const SPIN_CONFIG = {
    duration: 3000,
    easing: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
    spinCount: 5,
  };

  const wheelColors = [
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F43F5E",
  ];

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/voucherForCustomer"
        );
        setVouchers(res.data);
        const formatted = res.data.map(
          (v: Voucher) =>
            `Giảm ${v.discount_value.toLocaleString("vi-VN")}đ | ${v.code}`
        );
        setDisplayVouchers([...formatted, "Chúc bạn may mắn lần sau"]);
      } catch {
        setDisplayVouchers(["Chúc bạn may mắn lần sau", "Thử lại lần sau"]);
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    if (user?.point_available) {
      setSpinCount(Math.floor(user.point_available / 50));
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isVoucher = (text: string) =>
    !text.includes("may mắn") && !text.includes("Thử lại");

  const spinWheel = async () => {
    if (spinning || displayVouchers.length === 0 || spinCount <= 0 || !user)
      return;

    setSpinning(true);
    setResult(null);

    const rewardCount = displayVouchers.length;
    const randomIndex = Math.floor(Math.random() * rewardCount);
    const degreePerItem = 360 / rewardCount;
    const newRotation =
      360 * SPIN_CONFIG.spinCount +
      randomIndex * degreePerItem +
      degreePerItem / 2;

    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${SPIN_CONFIG.duration}ms ${SPIN_CONFIG.easing}`;
      wheelRef.current.style.transform = `rotate(${newRotation}deg)`;
    }

    setTimeout(async () => {
      const selectedReward = displayVouchers[randomIndex];
      setResult(selectedReward);
      setSpinning(false);
      setSpinCount((prev) => prev - 1);

      const matchedVoucher = vouchers.find((v) =>
        selectedReward.includes(v.code)
      );

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/themVoucherWheel",
          {
            customer_id: Number(user.id),
            voucher_id: matchedVoucher ? matchedVoucher.id : null,
          }
        );

        if (matchedVoucher) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        setNotifyMessage(
          res.data.message || "🎉 Bạn đã nhận được phần thưởng!"
        );
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        setNotifyMessage(
          error?.response?.data?.message || "❌ Có lỗi xảy ra khi quay thưởng."
        );
      }
    }, SPIN_CONFIG.duration);
  };

  return (
    <>
      {/* Nút quay */}
      <div className="fixed bottom-36 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="relative p-5 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-xl hover:scale-110 transition-transform text-white font-bold text-xl"
        >
          🎯
          <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
            {spinCount}
          </span>
        </button>
      </div>

      {/* Popup vòng quay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div
            ref={popupRef}
            className="relative bg-white rounded-3xl p-6 max-w-lg w-full text-center shadow-2xl border"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 bg-red-100 p-2 rounded-full"
            >
              <X className="text-red-500" />
            </button>

            <h2 className="text-2xl font-bold mb-2 text-amber-700">
              Vòng quay may mắn
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Bạn còn <strong>{spinCount}</strong> lượt quay
            </p>

            {/* Vòng quay */}
            <div className="relative w-96 h-96 mx-auto mb-6">
              <div
                ref={wheelRef}
                className="rounded-full w-full h-full bg-gray-100 border-4 border-amber-300 flex items-center justify-center transition-transform"
              >
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {displayVouchers.map((_, index) => {
                    const angle = 360 / displayVouchers.length;
                    const startAngle = angle * index - 90;
                    const endAngle = startAngle + angle;
                    const colorIndex = index % wheelColors.length;
                    const centerX = 100;
                    const centerY = 100;
                    const radius = 90;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const x1 = centerX + radius * Math.cos(startRad);
                    const y1 = centerY + radius * Math.sin(startRad);
                    const x2 = centerX + radius * Math.cos(endRad);
                    const y2 = centerY + radius * Math.sin(endRad);

                    const largeArc = angle > 180 ? 1 : 0;
                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ");

                    return (
                      <path
                        key={index}
                        d={pathData}
                        fill={wheelColors[colorIndex]}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            <button
              onClick={spinWheel}
              disabled={spinning || spinCount <= 0}
              className={`w-full py-3 font-semibold rounded-lg text-white transition-colors ${
                spinning || spinCount <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {spinning ? "Đang quay..." : "Quay ngay"}
            </button>

            {/* Kết quả quay */}
            {result && !spinning && (
              <div className="mt-4 p-4 rounded-xl bg-white border-2 shadow">
                <h3 className="font-bold text-lg mb-1">
                  {isVoucher(result)
                    ? "🎉 Chúc mừng bạn!"
                    : "Chúc bạn may mắn lần sau!"}
                </h3>
                <p>{result}</p>
                {isVoucher(result) && (
                  <Confetti width={300} height={150} recycle={false} />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup thông báo */}
      {notifyMessage && (
        <NotificationPopup
          message={notifyMessage}
          onClose={() => setNotifyMessage(null)}
        />
      )}
    </>
  );
}
