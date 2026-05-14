"use client";
import { motion } from "framer-motion";
import { FiDollarSign } from "react-icons/fi";
import type { PaymentNotesFormProps } from "../../types/Booking/PaymentNotesForm.types";

export default function PaymentNotesForm({
  formData,
  setFormData,
}: PaymentNotesFormProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiDollarSign className="mr-2 text-[#AF763E]" />
        Thanh toán & Ghi chú
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hình thức thanh toán
          </label>
          <select
            value={formData.payment_method}
            onChange={(e) =>
              setFormData({ ...formData, payment_method: e.target.value })
            }
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg outline-none transition hover:border-[#AF763E] focus:border-[#AF763E] focus:ring-1 focus:ring-[#AF763E]"
          >
            <option value="cash">Tiền mặt khi đến</option>
            <option value="vnpay">Thanh toán VNPay</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none transition hover:border-[#AF763E] focus:border-[#AF763E] focus:ring-1 focus:ring-[#AF763E]"
            rows={3}
            placeholder="Yêu cầu đặc biệt, dị ứng thức ăn..."
          />
        </div>
      </div>
    </motion.div>
  );
}
