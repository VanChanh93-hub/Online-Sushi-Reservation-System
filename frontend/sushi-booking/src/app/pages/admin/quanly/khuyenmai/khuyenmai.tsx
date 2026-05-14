"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BiPrinter } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import TitleDesc from "@/src/app/components/ui/titleDesc";
import { Button } from "@/src/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/app/components/ui/Card";
import Pagination from "@/src/app/components/ui/Panigation";
import Popup from "@/src/app/components/ui/Popup";
import InputField from "@/src/app/components/ui/InputField";

import { Voucher, VoucherAdd } from "@/src/app/types/voucher";
import { addVoucher } from "@/src/app/hooks/useAdd";

export default function QuanLyNguoiDung() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherPage, setVoucherPage] = useState(1);
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const itemsPerPage = 10;

  const [newVoucher, setNewVoucher] = useState<VoucherAdd>({
    code: "",
    discount_value: 0,
    start_date: "",
    end_date: "",
    status: "active",
    usage_limit: 1,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/voucher")
      .then((res) => setVouchers(res.data))
      .catch((err) => console.error("Lỗi khi lấy vouchers:", err));
  }, []);

  const paginate = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const currentVouchers = paginate(vouchers, voucherPage);

  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await addVoucher(newVoucher);
      setVouchers((prev) => [...prev, added]);
      setOpenAddPopup(false);
    } catch (error) {
      console.error("Thêm voucher thất bại:", error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 bg-[#fff8f0]">
      {/* Header */}
      <TitleDesc
        title="Quản lý khuyến mãi"
        description="Xem và quản lý tất cả khuyến mãi trong hệ thống."
        className="col-span-12"
      />

      {/* Bộ lọc */}
      <div className="col-span-12">
        <Card className="bg-[#fff7f2]">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Trạng thái
              </label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                <option>Tất cả</option>
                <option>Chờ xử lý</option>
                <option>Đã xử lý</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Thời gian
              </label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                <option>Tất cả</option>
                <option>Hôm nay</option>
                <option>Tuần này</option>
                <option>Tháng này</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Giá trị khuyến mãi
              </label>
              <select className="w-full bg-gray-200 px-4 py-2 rounded-md ">
                <option>Tất cả</option>
                <option>Dưới 100</option>
                <option>Trên 100</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-3 flex justify-end">
              <button className="w-full bg-[#9c6b66] text-white px-6 py-2 rounded-xl">
                Lọc khuyến mãi
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {[
          { label: "Tổng số khuyến mãi", value: vouchers.length },
          {
            label: "Khuyến mãi đang hoạt động",
            value: vouchers.filter((v) => v.status === "active").length,
          },
        ].map((item, i) => (
          <Card className="col-span-6" key={i}>
            <CardContent>
              <p className="text-base text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="col-span-12">
        <Card>
          <CardHeader header="Danh sách khuyến mãi">
            <div className="flex gap-2 float-right">
              <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm">
                <PiMicrosoftExcelLogoFill /> Xuất Excel
              </Button>
              <Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm">
                <BiPrinter /> In
              </Button>
              <Button
                className="flex items-center gap-2 px-3 py-1 bg-[#9c6b66] text-white rounded text-sm"
                onClick={() => setOpenAddPopup(true)}
              >
                + Thêm voucher
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                  <tr>
                    <th className="px-4 py-2">Id</th>
                    <th className="px-4 py-2">Mã khuyến mãi</th>
                    <th className="px-4 py-2">Giá trị</th>
                    <th className="px-4 py-2">Ngày bắt đầu</th>
                    <th className="px-4 py-2">Ngày hết hạn</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Số lượng</th>
                    <th className="px-4 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVouchers.map((voucher, index) => (
                    <tr
                      key={voucher.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                    >
                      <td className="px-4 py-2">{voucher.id}</td>
                      <td className="px-4 py-2">{voucher.code}</td>
                      <td className="px-4 py-2">{voucher.discount_value}</td>
                      <td className="px-4 py-2">{voucher.start_date}</td>
                      <td className="px-4 py-2">{voucher.end_date}</td>
                      <td className="px-4 py-2 text-blue-700">{voucher.status}</td>
                      <td className="px-4 py-2">{voucher.usage_limit}</td>
                      <td className="px-4 py-2">
                        <button className="px-1 flex items-center gap-1 text-red-700 border border-red-700 rounded hover:bg-red-100">
                          {voucher.status === "active" ? <FaEyeSlash /> : <FaEye />}
                          <span className="text-red-700 font-semibold">
                            {voucher.status === "active" ? "Khóa" : "Mở khóa"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={voucherPage}
                totalItems={vouchers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setVoucherPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Thêm Voucher */}
      <Popup
        isOpen={openAddPopup}
        onClose={() => setOpenAddPopup(false)}
        title="Thêm Voucher Mới"
      >
        <form onSubmit={handleAddVoucher} className="grid grid-cols-2 gap-4">
          <InputField
            label="Mã khuyến mãi"
            name="code"
            value={newVoucher.code}
            onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
          />
          <InputField
            label="Giá trị khuyến mãi"
            name="discount_value"
            type="number"
            value={String(newVoucher.discount_value)}
            onChange={(e) =>
              setNewVoucher({ ...newVoucher, discount_value: parseFloat(e.target.value) })
            }
          />
          <InputField
            label="Số lượng sử dụng"
            name="usage_limit"
            type="number"
            value={String(newVoucher.usage_limit)}
            onChange={(e) =>
              setNewVoucher({ ...newVoucher, usage_limit: parseInt(e.target.value) })
            }
          />
          <InputField
            label="Ngày bắt đầu"
            name="start_date"
            type="date"
            value={newVoucher.start_date}
            onChange={(e) => setNewVoucher({ ...newVoucher, start_date: e.target.value })}
          />
          <InputField
            label="Ngày kết thúc"
            name="end_date"
            type="date"
            value={newVoucher.end_date}
            onChange={(e) => setNewVoucher({ ...newVoucher, end_date: e.target.value })}
          />
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={newVoucher.status}
              onChange={(e) =>
                setNewVoucher({
                  ...newVoucher,
                  status: e.target.value as "active" | "inactive",
                })
              }
            >
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          <div className="col-span-2 flex justify-end">
            <Button
              type="submit"
              className="bg-[#9c6b66] text-white px-4 py-2 rounded hover:bg-[#814d4a]"
            >
              Thêm voucher
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  );
}
