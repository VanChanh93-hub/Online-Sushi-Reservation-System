"use client"

import { useState } from "react"
import TitleDesc from "../../../../components/ui/titleDesc"
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card"
import Pagination from "../../../../components/ui/Panigation"
import SearchInput from "../../../../components/ui/SearchInput"
import { useFetch } from "@/src/app/hooks/useFetch"
import Popup from "@/src/app/components/ui/Popup"

export default function QuanLyDonHang() {
  const { orders, fetchOrderDetail, orderDetail } = useFetch()
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const itemsPerPage = 5

  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const ordersToday = orders.filter((order) => {
    const today = new Date().toISOString().slice(0, 10)
    return order.created_at?.slice(0, 10) === today
  })

  const totalToday = ordersToday.length
  const pendingOrders = orders.filter((order) => order.status === "pending")
  const confirmedOrders = orders.filter((order) => order.status === "success")
  const totalRevenue = confirmedOrders.reduce((sum, order) => sum + Number(order.total_price || 0), 0)

  // Hàm xử lý khi click vào nút "Chi tiết"
  const handleViewDetail = async (orderId: number) => {
    setSelectedOrderId(orderId)
    await fetchOrderDetail(orderId)
    setShowOrderDetail(true)
  }

  // Hàm đóng popup chi tiết
  const handleCloseDetail = () => {
    setShowOrderDetail(false)
    setSelectedOrderId(null)
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Header */}
      <TitleDesc
        title="Quản lý đơn hàng"
        description="Xem và quản lý tất cả những đơn hàng"
        className="col-span-12"
      />

      {/* Bộ lọc */}
      <div className="col-span-12">
        <Card className="bg-[#fff7f2]">
          <div className="grid grid-cols-12 gap-4 items-end">
            {/* Trạng thái */}
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">Trạng thái</label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md appearance-none">
                <option>Tất cả</option>
                <option>Chờ xử lý</option>
                <option>Đã xử lý</option>
              </select>
            </div>

            {/* Thời gian */}
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">Thời gian</label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md appearance-none">
                <option>Hôm nay</option>
                <option>Tuần này</option>
                <option>Tháng này</option>
              </select>
            </div>

            {/* Phương thức thanh toán */}
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">Phương thức thanh toán</label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md appearance-none">
                <option>Tất cả</option>
                <option>Tiền mặt</option>
                <option>Chuyển khoản</option>
              </select>
            </div>

            {/* Nút lọc */}
            <div className="col-span-12 md:col-span-3 flex justify-end">
              <button className="w-full bg-[#9c6b66] text-white px-6 py-2 rounded-xl">Lọc đơn hàng</button>
            </div>
          </div>
        </Card>
      </div>

      {/* Thống kê nhanh */}
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {[
          { label: "Tổng đơn hôm nay", value: totalToday },
          { label: "Tổng đơn chờ xử lý", value: pendingOrders.length },
          { label: "Đơn đã xử lý", value: confirmedOrders.length },
          { label: "Tổng doanh thu", value: totalRevenue.toLocaleString() + " ₫" },
        ].map((item, i) => (
          <Card className="col-span-3" key={i}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bảng đơn đặt bàn */}
      <div className="col-span-12">
        <Card>
          <CardHeader header="Tất cả đơn hàng" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                  <tr>
                    <th className="px-4 py-2">MÃ ĐƠN</th>
                    <th className="px-4 py-2">KHÁCH HÀNG</th>
                    <th className="px-4 py-2">TỔNG TIỀN</th>
                    <th className="px-4 py-2">TRẠNG THÁI</th>
                    <th className="px-4 py-2">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, idx) => (
                    <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-4 py-2">#{order.id}</td>
                      <td className="px-4 py-2">{order.customer?.name}</td>
                      <td className="px-4 py-2">{order.total_price.toLocaleString()} ₫</td>
                      <td className="px-4 py-2">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.status === "pending"
                            ? "Chờ xử lý"
                            : order.status === "confirmed"
                              ? "Đã xác nhận"
                              : order.status === "cancelled"
                                ? "Đã hủy"
                                : order.status === "success"
                                  ? "Hoàn tất"
                                  : "Không rõ"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                          onClick={() => handleViewDetail(order.id)}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Phân trang */}
              <Pagination
                currentPage={currentPage}
                totalItems={orders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popup hiển thị chi tiết đơn hàng */}
      <Popup
        isOpen={showOrderDetail}
        onClose={handleCloseDetail}
        title={`Chi tiết đơn hàng #${selectedOrderId}`}
        width="w-full md:w-[800px] lg:w-[900px]"
      >
        {!orderDetail ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Đang tải thông tin...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Thông tin đơn hàng */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Thông tin đơn hàng</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium ml-2">#{orderDetail.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium ml-2">{new Date(orderDetail.created_at).toLocaleString("vi-VN")}</span>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      orderDetail.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : orderDetail.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : orderDetail.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : orderDetail.status === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {orderDetail.status === "pending"
                      ? "Chờ xử lý"
                      : orderDetail.status === "confirmed"
                        ? "Đã xác nhận"
                        : orderDetail.status === "cancelled"
                          ? "Đã hủy"
                          : orderDetail.status === "success"
                            ? "Hoàn tất"
                            : "Không rõ"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-bold ml-2 text-green-600">
                    {Number(orderDetail.total_price).toLocaleString()} ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin khách hàng */}
            {orderDetail.customer && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Tên khách hàng:</span>
                    <span className="font-medium ml-2">{orderDetail.customer.name}</span>
                  </div>
                  {orderDetail.customer.phone && (
                    <div>
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-medium ml-2">{orderDetail.customer.phone}</span>
                    </div>
                  )}
                  {orderDetail.customer.email && (
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium ml-2">{orderDetail.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Thông tin bàn */}
            {orderDetail.tables && orderDetail.tables.length > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Thông tin bàn</h3>
                <div className="space-y-2 text-sm">
                  {orderDetail.tables.map((table, idx) => (
                    <div key={table.id || idx}>
                      <span className="text-gray-600">Bàn số:</span>
                      <span className="font-medium ml-2">{table.table_number}</span>

                      {table.max_guests && (
                        <>
                          <span className="text-gray-600 ml-4">Sức chứa:</span>
                          <span className="font-medium ml-2">{table.max_guests} người</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chi tiết món ăn */}
            {orderDetail.items && orderDetail.items.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Chi tiết món ăn</h3>
                <div className="space-y-3">
                  {orderDetail.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {item.food?.name || item.combo?.name || "Món ăn"}
                        </div>
                        {/* {item.food?.description && (
                          <div className="text-sm text-gray-600 mt-1">{item.food.description}</div>
                        )} */}
                      </div>
                      <div className="text-center mx-4">
                        <div className="text-sm text-gray-600">Số lượng</div>
                        <div className="font-medium">{item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Đơn giá</div>
                        <div className="font-medium">{Number(item.price).toLocaleString()} ₫</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-600">Thành tiền</div>
                        <div className="font-bold text-green-600">
                          {(Number(item.price) * item.quantity).toLocaleString()} ₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ghi chú */}
            {/* {orderDetail.notes && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Ghi chú</h3>
                <p className="text-sm text-gray-700">{orderDetail.notes}</p>
              </div>
            )} */}
          </div>
        )}
      </Popup>
    </div>
  )
}
