"use client";
import { FiUser, FiPhone } from "react-icons/fi";
import type { CustomerInfoFormProps } from "../../types/Booking/CustomerInfoForm.types";

export default function CustomerInfoForm({
  formData,
  setFormData,
}: CustomerInfoFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-opacity duration-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiUser className="mr-2 text-[#AF763E]" />
        Thông tin liên hệ
      </h2>

      <div className="space-y-4">
        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer_name: e.target.value,
                })
              }
              placeholder="Nhập họ tên"
              className="w-full pl-10 pr-3 py-2.5 border border-[#e5d5c2] rounded-lg focus:ring-1 focus:ring-[#AF763E] focus:border-[#AF763E] outline-none transition"
            />
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[#AF763E]" />
          </div>
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.customer_phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer_phone: e.target.value,
                })
              }
              placeholder="Nhập số điện thoại"
              className="w-full pl-10 pr-3 py-2.5 border border-[#e5d5c2] rounded-lg focus:ring-1 focus:ring-[#AF763E] focus:border-[#AF763E] outline-none transition"
            />
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[#AF763E]" />
          </div>
        </div>
      </div>
    </div>
  );
}
