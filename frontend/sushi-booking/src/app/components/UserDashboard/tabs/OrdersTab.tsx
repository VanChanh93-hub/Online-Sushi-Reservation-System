"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/authContext";
import StatusBadge from "../ui/StatusBadge";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ORDERS_PER_PAGE = 5;

export default function OrdersTab() {
  const { user: authUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authUser?.id) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `http://127.0.0.1:8000/api/orders/history/${authUser.id}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authUser?.id]);

  // Tính toán phân trang
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [orders, currentPage]);

  const viewOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AF763E]"></div>
      </div>
    );
  }

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
      <h2 className="text-2xl font-bold text-[#AF763E] mb-6 border-b pb-2 border-[#AF763E]/20">
        Lịch sử đơn hàng
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-wooden-light rounded-lg">
          <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào.</p>
          <button
            className="px-4 py-2 bg-[#AF763E] text-white rounded-lg hover:bg-[#AF763E]/90"
            onClick={() => window.location.reload()}
          >
            Tải lại
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-auto shadow ring-1 ring-[#AF763E]/20 rounded-xl">
            <table className="min-w-full divide-y divide-[#AF763E]/10">
              <thead className="bg-[#AF763E]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Mã đơn
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Ngày đặt
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#AF763E]/10">
                {paginatedOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-[#AF763E]/5 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.order_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(order.total_price).toLocaleString()}đ
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewOrderDetail(order)}
                        className="text-[#AF763E] hover:text-[#AF763E]/80 font-medium"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang gọn gàng */}
          {orders.length > ORDERS_PER_PAGE && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * ORDERS_PER_PAGE + 1}-
                {Math.min(currentPage * ORDERS_PER_PAGE, orders.length)} trên{" "}
                {orders.length} đơn hàng
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

          {/* Order Detail Modal (giữ nguyên như cũ) */}
          <AnimatePresence>
            {showDetail && selectedOrder && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowDetail(false)}
              >
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-[#AF763E]">
                          Chi tiết đơn hàng #{selectedOrder.order_id}
                        </h3>
                        <p className="text-gray-500">
                          Ngày đặt:{" "}
                          {new Date(selectedOrder.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDetail(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#AF763E]/10 p-4 rounded-lg border border-[#AF763E]/20">
                        <h4 className="font-medium text-lg mb-3 text-[#AF763E]">
                          Thông tin đơn hàng
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Trạng thái:</span>{" "}
                            <StatusBadge status={selectedOrder.status} />
                          </p>
                          <p>
                            <span className="font-medium">Tổng tiền:</span>{" "}
                            {parseFloat(
                              selectedOrder.total_price
                            ).toLocaleString()}
                            đ
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-lg mb-3 text-[#AF763E]">
                        Danh sách món ăn
                      </h4>
                      <div className="border border-[#AF763E]/20 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-[#AF763E]/10">
                          <thead className="bg-[#AF763E]">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                Tên món
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                Số lượng
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                Đơn giá
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-white">
                                Thành tiền
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[#AF763E]/10">
                            {selectedOrder.items?.map(
                              (item: any, index: number) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.food_name ||
                                      item.combo_name ||
                                      "Không xác định"}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {parseFloat(item.price).toLocaleString()}đ
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {(
                                      item.quantity * parseFloat(item.price)
                                    ).toLocaleString()}
                                    đ
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>

                          <tfoot className="bg-[#AF763E]/10">
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-3 text-right text-sm font-medium text-gray-500"
                              >
                                Tổng cộng:
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-[#AF763E]">
                                {parseFloat(
                                  selectedOrder.total_price
                                ).toLocaleString()}
                                đ
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setShowDetail(false)}
                        className="px-4 py-2 bg-[#AF763E] text-white rounded-lg hover:bg-[#AF763E]/90"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
