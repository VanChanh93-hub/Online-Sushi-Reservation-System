"use client";
import React, { useState } from "react";
import TitleDesc from "../../../../components/ui/titleDesc";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/src/app/components/ui/button";
import { Card, CardHeader , CardContent } from "../../../../components/ui/Card";
import Pagination from "../../../../components/ui/Panigation";
import { useFetch } from "@/src/app/hooks/useFetch";
import { Table } from "@/src/app/types";
import Popup from "@/src/app/components/ui/Popup";
import InputField from "@/src/app/components/ui/InputField";
import { addTable } from "@/src/app/hooks/useAdd";

export default function QuanLyBan() {
  const { tables } = useFetch();
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({
    table_number: "",
    max_guests: "",
    status: "available",
  });
  
  const itemsPerPage = 6;

  const paginatedData = tables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-600";
      case "occupied":
        return "bg-red-100 text-red-600";
      case "reserved":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleAddTable = async () => {
  const maxGuests = parseInt(formData.max_guests);
  if (isNaN(maxGuests) || maxGuests < 1) {
    alert("Số lượng khách tối đa phải là số hợp lệ!");
    return;
  }

  try {
    await addTable({
      table_number: formData.table_number,
      max_guests: maxGuests,
      status: formData.status as "available" | "reserved" | "occupied",
    });
    setOpenPopup(false);
    location.reload();
  } catch (err) {
    console.error("Lỗi khi thêm bàn:", err);
    alert("Không thể thêm bàn. Vui lòng kiểm tra dữ liệu đầu vào hoặc kiểm tra log server.");
  }
};


  return (
  <div className="min-h-screen px-6 py-4">
    <TitleDesc
      title="Quản lý bàn"
      description="Xem và quản lý tất cả bàn trong hệ thống"
      className="mb-6"
    />

    <div className="col-span-12 mb-6">
      <Card>
        <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-3">
                <label className="text-sm text-gray-700 font-medium block mb-1">Trạng thái</label>
                <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                    <option>Tất cả</option>
                    <option>Còn trống</option>
                    <option>Đã đặt</option>
                    <option>Đang sử dụng</option>
                </select>
            </div>
            <div className="col-span-12 md:col-span-3">
                <label className="text-sm text-gray-700 font-medium block mb-1">Thời gian</label>
                <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                    <option>Tất cả</option>
                    <option>Hôm nay</option>
                    <option>Tuần này</option>
                    <option>Tháng này</option>
                </select>
            </div>
            <div className="col-span-12 md:col-span-3">
                <label className="text-sm text-gray-700 font-medium block mb-1">Số lượng khách</label>
                <select className="w-full bg-gray-200 px-4 py-2 rounded-md">
                    <option>Tất cả</option>
                    <option>4 khách</option>
                    <option>6 khách</option>
                    <option>8 khách</option>
                    <option>10 khách</option>
                </select>
            </div>
            <div className="col-span-12 md:col-span-3 flex justify-end">
                <Button className="w-full bg-[#9c6b66] text-white px-6 py-2 rounded-xl">
                    Lọc
                </Button>
            </div>
        </div>
        <div className="mt-6">
          <Button
            className="bg-[#f3eae4] text-[#9c6b66] px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer"
            onClick={() => setOpenPopup(true)}
          >
            <FaPlus /> Thêm bàn
          </Button>
        </div>
      </Card>
    </div>

    <Popup
      isOpen={openPopup}
      onClose={() => setOpenPopup(false)}
      title="Thêm bàn mới"
    >
      <div className="space-y-4">
        <InputField
          label="Số bàn"
          name="table_number"
          value={formData.table_number}
          onChange={handleChange}
        />
        <InputField
          label="Số khách tối đa"
          name="max_guests"
          type="number"
          value={formData.max_guests}
          onChange={handleChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="available">Còn trống</option>
            <option value="occupied">Đang sử dụng</option>
            <option value="reserved">Đã đặt</option>
          </select>
        </div>
        <Button
          className="w-full bg-[#9c6b66] text-white py-2 rounded"
          onClick={handleAddTable}
        >
          Thêm bàn
        </Button>
      </div>
    </Popup>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedData.map((table: Table, idx: number) => (
        <Card key={idx}>
          <CardHeader header={`Bàn số ${table.table_number}`} />
          <CardContent>
            <div className="text-sm mb-2">
              <strong>Khách tối đa:</strong> {table.max_guests}
            </div>
            <div className="mb-2">
              <strong>Trạng thái:</strong>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  table.status
                )}`}
              >
                {table.status === "available"
                  ? "Còn trống"
                  : table.status === "occupied"
                  ? "Đang sử dụng"
                  : table.status === "reserved"
                  ? "Đã đặt"
                  : table.status}
              </span>
            </div>

            {/* Hiển thị khung giờ mẫu (có thể sau này thay bằng API gọi giờ rảnh thực tế) */}
            <div className="mt-2">
              <strong>Khung giờ:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {["10:00", "12:15", "14:30", "16:45", "18:00", "20:15"].map(
                  (time, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#ffeeda] text-[#5c4033] rounded text-xs"
                    >
                      {time}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mt-4">
              <button className="text-blue-600 hover:underline text-sm">
                Chi tiết
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="mt-6">
      <Pagination
        currentPage={currentPage}
        totalItems={tables.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  </div>
);

}
