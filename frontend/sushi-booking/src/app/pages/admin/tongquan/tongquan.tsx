"use client";
import React from "react";
import TitleDesc from "../../../components/ui/titleDesc";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import Calendar from "../../../components/ui/Calendar";
import { Plus, FileText, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function TongQuan() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Header */}
      <TitleDesc
        title="Tổng quan"
        description="Chào mừng trở lại, Admin Takumi"
        className="col-span-12"
      />

      {/* Stats */}
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {[
          { label: "Đơn hàng hôm nay", value: "24" },
          { label: "Doanh thu hôm nay", value: "9.560.000 ₫" },
          { label: "Đặt bàn hôm nay", value: "18" },
          { label: "Người dùng mới", value: "6" },
        ].map((item, i) => (
          <Card className="col-span-3" key={i}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders and Bookings */}
      <div className="col-span-8 grid grid-cols-1 gap-4">
        <Card>
          <CardHeader
            header="Đơn hàng gần đây"
            className="flex justify-between items-center"
          >
            <div className="flex gap-2">
              <Link
                href={`/quan-tri/quan-ly/dat-ban`}
                className="font-medium text-sm"
              >
                Xem tất cả
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                  <tr>
                    <th className="px-4 py-2">MÃ ĐƠN</th>
                    <th className="px-4 py-2">KHÁCH HÀNG</th>
                    <th className="px-4 py-2">THỜI GIAN</th>
                    <th className="px-4 py-2">TỔNG TIỀN</th>
                    <th className="px-4 py-2">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "OD001",
                      customer: "Nguyễn Văn A",
                      time: "20/05/2025 18:30",
                      total: "1.200.000đ",
                      status: "Đã thanh toán",
                    },
                    {
                      id: "OD002",
                      customer: "Trần Thị B",
                      time: "21/05/2025 12:00",
                      total: "750.000đ",
                      status: "Chưa thanh toán",
                    },
                    {
                      id: "OD003",
                      customer: "Lê Văn C",
                      time: "22/05/2025 19:00",
                      total: "980.000đ",
                      status: "Đã thanh toán",
                    },
                  ].map((order, idx) => (
                    <tr
                      key={order.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                    >
                      <td className="px-4 py-2">{order.id}</td>
                      <td className="px-4 py-2">{order.customer}</td>
                      <td className="px-4 py-2">{order.time}</td>
                      <td className="px-4 py-2">{order.total}</td>
                      <td
                        className={`px-4 py-2 ${
                          order.status === "Đã thanh toán"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            header="Đặt bàn gần đây"
            className="flex justify-between items-center"
          >
            <div className="flex gap-2">
              <Link
                href={`/quan-tri/quan-ly/dat-ban`}
                className="font-medium text-sm"
              >
                Xem tất cả
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                  <tr>
                    <th className="px-4 py-2">MÃ ĐẶT BÀN</th>
                    <th className="px-4 py-2">KHÁCH HÀNG</th>
                    <th className="px-4 py-2">THỜI GIAN</th>
                    <th className="px-4 py-2">SỐ LƯỢNG</th>
                    <th className="px-4 py-2">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "BK001",
                      customer: "Nguyễn Văn D",
                      time: "20/05/2025 17:00",
                      quantity: 4,
                      status: "Đã xác nhận",
                    },
                    {
                      id: "BK002",
                      customer: "Phạm Thị E",
                      time: "21/05/2025 19:30",
                      quantity: 2,
                      status: "Đang chờ",
                    },
                    {
                      id: "BK003",
                      customer: "Trần Văn F",
                      time: "22/05/2025 12:00",
                      quantity: 6,
                      status: "Đã huỷ",
                    },
                  ].map((booking, idx) => (
                    <tr
                      key={booking.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                    >
                      <td className="px-4 py-2">{booking.id}</td>
                      <td className="px-4 py-2">{booking.customer}</td>
                      <td className="px-4 py-2">{booking.time}</td>
                      <td className="px-4 py-2">{booking.quantity} người</td>
                      <td
                        className={`px-4 py-2 ${
                          booking.status === "Đã xác nhận"
                            ? "text-green-600"
                            : booking.status === "Đang chờ"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {booking.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel */}
      <div className="col-span-4 grid gap-4">
        {/* Notifications */}
        <Card>
          <CardHeader header="Thông báo" />
          <CardContent>
            <ul>
              <li>
                <strong>Hệ thống:</strong> Có 2 đơn chưa được xử lý.
              </li>
              <li>
                <strong>Đặt bàn mới:</strong> Có khách hàng vừa đặt bàn lúc
                9:35.
              </li>
              <li>
                <strong>Cập nhật hệ thống:</strong> Hệ thống sẽ bảo trì lúc
                23:00 tối nay.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader header="Thao tác nhanh"></CardHeader>
          <CardContent
            className="grid grid-cols-2 gap-2"
            content="Chưa có dữ liệu"
          >
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Thêm món
            </Button>
            <Button className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Báo cáo
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Tạo đơn
            </Button>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader header="Lịch"></CardHeader>
          <CardContent>
            <Calendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
