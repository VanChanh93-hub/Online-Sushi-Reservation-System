"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import { motion } from "framer-motion";
import {
  Gift,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function VouchersTab() {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho bộ lọc và phân trang
  const [expiryFilter, setExpiryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"high" | "low" | "none">("none");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch dữ liệu voucher
  useEffect(() => {
    if (!user?.id) return;

    const fetchVouchers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `http://127.0.0.1:8000/api/getAllVoucherByUser/${user.id}`
        );
        setVouchers(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("Lỗi khi tải voucher:", err);
        setError("Không thể tải danh sách voucher. Vui lòng thử lại sau.");
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [user?.id]);

  // Áp dụng bộ lọc và sắp xếp
  const filteredVouchers = useMemo(() => {
    let result = [...vouchers];

    if (expiryFilter === "active") {
      result = result.filter((v) => new Date(v.end_date) > new Date());
    } else if (expiryFilter === "expired") {
      result = result.filter((v) => new Date(v.end_date) <= new Date());
    }

    if (sortBy === "high") {
      result.sort(
        (a, b) => parseInt(b.discount_value) - parseInt(a.discount_value)
      );
    } else if (sortBy === "low") {
      result.sort(
        (a, b) => parseInt(a.discount_value) - parseInt(b.discount_value)
      );
    }

    return result;
  }, [vouchers, expiryFilter, sortBy]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredVouchers.length / ITEMS_PER_PAGE);
  const paginatedVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVouchers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredVouchers, currentPage]);

  const resetFilters = () => {
    setExpiryFilter("all");
    setSortBy("none");
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AF763E]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#AF763E] text-white rounded-lg hover:bg-[#AF763E]/90"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header với bộ lọc */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Gift className="text-[#AF763E] w-8 h-8" />
          <h2 className="text-2xl font-bold text-[#AF763E]">Voucher của bạn</h2>
          {filteredVouchers.length > 0 && (
            <span className="bg-[#AF763E]/10 text-[#AF763E] px-3 py-1 rounded-full text-sm">
              {filteredVouchers.length} voucher
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Bộ lọc */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#AF763E] text-white rounded-lg hover:bg-[#AF763E]/90"
            >
              <Filter className="w-5 h-5" />
              <span>Bộ lọc</span>
            </button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Tùy chọn lọc</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời hạn sử dụng
                    </label>
                    <select
                      value={expiryFilter}
                      onChange={(e) => {
                        setExpiryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="all">Tất cả</option>
                      <option value="active">Còn hiệu lực</option>
                      <option value="expired">Đã hết hạn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sắp xếp theo giá trị
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSortBy(sortBy === "high" ? "none" : "high");
                          setCurrentPage(1);
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 ${
                          sortBy === "high"
                            ? "bg-[#AF763E] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span>Cao nhất</span>
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSortBy(sortBy === "low" ? "none" : "low");
                          setCurrentPage(1);
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 ${
                          sortBy === "low"
                            ? "bg-[#AF763E] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span>Thấp nhất</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="w-full py-2 px-3 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      {vouchers.length === 0 ? (
        <div className="text-center py-12 bg-wooden-light rounded-lg border border-[#AF763E]/20">
          <Gift className="mx-auto w-12 h-12 text-[#AF763E] mb-4" />
          <p className="text-gray-600 mb-4">Bạn chưa có voucher nào.</p>
          <button
            className="px-4 py-2 bg-[#AF763E] text-white rounded-lg hover:bg-[#AF763E]/90"
            onClick={() => window.location.reload()}
          >
            Tải lại
          </button>
        </div>
      ) : (
        <>
          {/* Bảng voucher */}
          <div className="overflow-x-auto rounded-xl mb-4 border border-[#AF763E]/20">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#AF763E]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Mã Voucher
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Giá trị giảm
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Ngày bắt đầu
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Ngày hết hạn
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedVouchers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Không tìm thấy voucher nào phù hợp
                    </td>
                  </tr>
                ) : (
                  paginatedVouchers.map((voucher, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-[#AF763E]/5 transition ${
                        new Date(voucher.end_date) <= new Date()
                          ? "opacity-70"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {voucher.code}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                        -
                        {parseInt(voucher.discount_value).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(voucher.start_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            new Date(voucher.end_date) > new Date()
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {new Date(voucher.end_date) > new Date()
                            ? "Có hiệu lực"
                            : "Đã hết hạn"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredVouchers.length
                )}{" "}
                trên {filteredVouchers.length} voucher
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#AF763E] text-white hover:bg-[#AF763E]/90"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-[#AF763E] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#AF763E] text-white hover:bg-[#AF763E]/90"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
