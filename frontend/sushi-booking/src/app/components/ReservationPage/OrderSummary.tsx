"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  FiHome,
  FiClock,
  FiChevronRight,
  FiImage,
  FiPercent,
  FiChevronDown,
  FiTag,
} from "react-icons/fi";

interface FoodItem {
  food_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ComboItem {
  combo_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  items: {
    name: string;
    quantity: number;
  }[];
}

interface FormData {
  guest_count: number;
  payment_method: "cash" | "online";
}

interface Table {
  location?: string;
}

interface Voucher {
  id: number;
  code: string;
  name: string;
  discount_amount: number;
  discount_type: "percent" | "fixed";
  expiry_date: string;
  min_order_amount?: number;
  status: string;
}

// interface cho dữ liệu từ API
interface RawVoucher {
  id: number;
  code: string;
  discount_value: number;
  end_date: string;
  status: string;
}

interface OrderSummaryProps {
  selectedTable: Table | null;
  selectedDate: string;
  selectedTime: string;
  foods: FoodItem[];
  formData: FormData;
  depositAmount: number;
  onAddFood: () => void;
  onAddCombo: () => void;
  onSubmitOrder: () => void;
  isLoading: boolean;
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  discountAmount: number;
  applyVoucherCode: () => void;
  combos?: ComboItem[];
  userId?: number;
  getPaymentAmount: () => number;
}

export default function OrderSummary({
  selectedTable,
  selectedDate,
  selectedTime,
  foods,
  formData,
  depositAmount,
  onAddFood,
  onAddCombo,
  onSubmitOrder,
  isLoading,
  voucherCode,
  setVoucherCode,
  discountAmount,
  applyVoucherCode,
  combos = [],
  userId,
}: OrderSummaryProps) {
  const [userVouchers, setUserVouchers] = useState<Voucher[]>([]);
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayGuestCount = Math.min(formData.guest_count, 10);
  const shouldDeposit = formData.guest_count >= 8;
  const effectiveDeposit = shouldDeposit ? depositAmount : 0;

  const originalTotal =
    foods.reduce((sum, food) => sum + food.price * food.quantity, 0) +
    combos.reduce((sum, combo) => sum + combo.price * combo.quantity, 0);

  const finalTotal = Math.max(originalTotal - discountAmount, 0);

  const payNowAmount =
    formData.payment_method === "cash" ? effectiveDeposit : finalTotal;

  const remainingCashPayment =
    formData.payment_method === "cash"
      ? Math.max(finalTotal - effectiveDeposit, 0)
      : 0;

  useEffect(() => {
    const fetchUserVouchers = async () => {
      if (!userId) return;

      setLoadingVouchers(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/getAllVoucherByUser/${userId}`
        );
        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data?.data)) {
            const formattedVouchers: Voucher[] = (
              data.data as RawVoucher[]
            ).map((voucher) => ({
              id: voucher.id,
              code: voucher.code,
              name: `Voucher ${voucher.code}`,
              discount_amount: voucher.discount_value,
              discount_type: "fixed",
              expiry_date: voucher.end_date,
              min_order_amount: 0,
              status: voucher.status,
            }));

            const activeUniqueVouchers: Voucher[] = formattedVouchers
              .filter(
                (v: Voucher) =>
                  v.status === "active" && new Date(v.expiry_date) > new Date()
              )
              .filter(
                (v: Voucher, i: number, self: Voucher[]) =>
                  i ===
                  self.findIndex(
                    (t: Voucher) => t.id === v.id && t.code === v.code
                  )
              );

            setUserVouchers(activeUniqueVouchers);
          } else {
            setUserVouchers([]);
          }
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setUserVouchers([]);
      } finally {
        setLoadingVouchers(false);
      }
    };

    fetchUserVouchers();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowVoucherDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVoucherSelect = (voucher: Voucher) => {
    setVoucherCode(voucher.code);
    setShowVoucherDropdown(false);
    setTimeout(() => {
      applyVoucherCode();
    }, 100);
  };

  const formatDiscountText = (voucher: Voucher) => {
    return `Giảm ${voucher.discount_amount.toLocaleString()} VNĐ`;
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Tóm tắt đơn đặt
      </h2>

      {selectedTable ? (
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <FiHome className="text-[#AF763E]" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Thông tin bàn</h3>
              <p className="text-sm text-gray-600">
                Bàn {displayGuestCount} khách
              </p>
              <p className="text-sm text-gray-600">
                {selectedDate} • {selectedTime}
              </p>
              {selectedTable.location && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="bg-gray-50 text-[#AF763E] px-2 py-1 rounded">
                    {selectedTable.location}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-6">
          <p className="text-[#AF763E] text-sm flex items-center">
            <FiClock className="mr-2" />
            Vui lòng chọn ngày, giờ và số lượng khách để xem bàn trống
          </p>
        </div>
      )}

      {/* Món ăn */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Món ăn đã chọn</h3>
        <button
          onClick={onAddFood}
          className="text-[#AF763E] hover:text-blue-800 text-sm flex items-center"
        >
          {foods.length > 0 ? "Chỉnh sửa" : "Thêm món"}
          <FiChevronRight className="ml-1" />
        </button>
      </div>

      {foods.length > 0 ? (
        <div className="space-y-3 mb-4">
          {foods.map((food) => (
            <div
              key={food.food_id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center">
                {food.image ? (
                  <Image
                    src={food.image || "/placeholder.svg"}
                    alt={food.name}
                    className="w-10 h-10 rounded-md object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                    <FiImage className="text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {food.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {food.price.toLocaleString()} VNĐ × {food.quantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">
                {(food.price * food.quantity).toLocaleString()} VNĐ
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
          <p className="text-gray-500 text-sm">Chưa có món nào được chọn</p>
          <button
            onClick={onAddFood}
            className="mt-2 text-[#AF763E] text-sm font-medium"
          >
            + Thêm món ăn
          </button>
        </div>
      )}

      {/* Combo */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Combo đã chọn</h3>
        <button
          onClick={onAddCombo}
          className="text-[#AF763E] hover:text-blue-800 text-sm flex items-center"
        >
          {combos.length > 0 ? "Chỉnh sửa" : "Thêm combo"}
          <FiChevronRight className="ml-1" />
        </button>
      </div>

      {combos.length > 0 ? (
        <div className="space-y-3 mb-4">
          {combos.map((combo) => (
            <div
              key={combo.combo_id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center">
                {combo.image ? (
                  <Image
                    src={combo.image || "/placeholder.svg"}
                    alt={combo.name}
                    className="w-10 h-10 rounded-md object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                    <FiImage className="text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {combo.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {combo.price.toLocaleString()} VNĐ × {combo.quantity}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {combo.items.map(
                      (
                        item: { name: string; quantity: number },
                        index: number
                      ) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                        >
                          {item.name} × {item.quantity}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium">
                {(combo.price * combo.quantity).toLocaleString()} VNĐ
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
          <p className="text-gray-500 text-sm">Chưa có combo nào được chọn</p>
          <button
            onClick={onAddCombo}
            className="mt-2 text-[#AF763E] text-sm font-medium"
          >
            + Thêm combo
          </button>
        </div>
      )}

      {/* Voucher Section */}
      <div className="mt-3 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mã giảm giá
        </label>
        <div className="relative" ref={dropdownRef}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                onFocus={() => setShowVoucherDropdown(true)}
                placeholder="Nhập mã giảm giá..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#AF763E]"
              />
              <button
                onClick={() => setShowVoucherDropdown(!showVoucherDropdown)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiChevronDown size={16} />
              </button>
            </div>
            <button
              onClick={applyVoucherCode}
              className="bg-[#AF763E] text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
              disabled={isLoading}
            >
              Áp dụng
            </button>
          </div>

          {/* Voucher Dropdown */}
          {showVoucherDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {loadingVouchers ? (
                <div className="p-3 text-center text-gray-500">
                  <span className="animate-spin mr-2">↻</span>
                  Đang tải voucher...
                </div>
              ) : userVouchers.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  Không có voucher khả dụng
                </div>
              ) : (
                userVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    onClick={() => handleVoucherSelect(voucher)}
                    className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <FiTag className="text-orange-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {voucher.code}
                            </p>
                            <p className="text-xs text-gray-600">
                              {voucher.name}
                            </p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {formatDiscountText(voucher)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          HSD:{" "}
                          {new Date(voucher.expiry_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {discountAmount > 0 && (
          <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
            <FiPercent className="text-green-500" />
            Giảm {discountAmount.toLocaleString()} VNĐ
          </p>
        )}
      </div>

      {/* Tính tiền */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium">
            {originalTotal.toLocaleString()} VNĐ
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between mb-1 text-green-700">
            <span className="text-sm">Giảm giá:</span>
            <span>-{discountAmount.toLocaleString()} VNĐ</span>
          </div>
        )}

        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Tiền cọc:</span>
          <span className="font-medium text-orange-600">
            {effectiveDeposit.toLocaleString()} VNĐ
          </span>
        </div>

        {formData.payment_method === "cash" ? (
          <div className="bg-blue-50 rounded-lg p-3 mt-3 mb-3">
            <p className="text-sm text-blue-700 font-medium">
              💰 Thanh toán tiền mặt
            </p>
            <p className="text-xs text-blue-600">
              {shouldDeposit
                ? "Thanh toán cọc trước, phần còn lại khi đến nhà hàng"
                : "Thanh toán toàn bộ khi đến nhà hàng"}
            </p>
          </div>
        ) : (
          <div className="bg-green-50 rounded-lg p-3 mt-3 mb-3">
            <p className="text-sm text-green-700 font-medium">
              📱 Thanh toán trực tuyến
            </p>
            <p className="text-xs text-green-600">
              Thanh toán toàn bộ qua ứng dụng
            </p>
          </div>
        )}

        <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
          <span className="font-semibold">
            {formData.payment_method === "cash"
              ? "Cần thanh toán ngay:"
              : "Tổng thanh toán:"}
          </span>
          <span className="font-bold text-red-600">
            {payNowAmount.toLocaleString()} VNĐ
          </span>
        </div>

        {formData.payment_method === "cash" && (
          <div className="mt-2 bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800 border border-yellow-200">
            <p className="mb-1 font-medium">💵 Thanh toán tại quán:</p>
            <p>
              {shouldDeposit ? (
                <>
                  Bạn đã cọc{" "}
                  <span className="font-semibold">
                    {effectiveDeposit.toLocaleString()} VNĐ
                  </span>
                  . Còn lại cần thanh toán khi đến quán:{" "}
                  <span className="font-bold text-red-600">
                    {remainingCashPayment.toLocaleString()} VNĐ
                  </span>
                </>
              ) : (
                <>
                  Bạn sẽ thanh toán toàn bộ{" "}
                  <span className="font-bold text-red-600">
                    {finalTotal.toLocaleString()} VNĐ
                  </span>{" "}
                  khi đến quán.
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onSubmitOrder}
        disabled={!selectedTable || isLoading}
        className={`w-full py-3 rounded-lg text-white mt-6 ${
          !selectedTable || isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#AF763E]"
        } transition-all shadow-md`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">↻</span>
            Đang xử lý...
          </span>
        ) : (
          "Xác nhận đặt bàn"
        )}
      </motion.button>
    </motion.div>
  );
}
