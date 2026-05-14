"use client";
import React, { useEffect, useState } from "react";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import SearchInput from "../../../../components/ui/SearchInput";

type InvoiceItem = {
  id: string;
  maDon: string;
  ban: string;
  tongTien: number;
  trangThai: "Chờ thanh toán" | "Đã thanh toán";
};

const fakeInvoices: InvoiceItem[] = [
  {
    id: "1",
    maDon: "HD001",
    ban: "Bàn 1",
    tongTien: 180000,
    trangThai: "Chờ thanh toán",
  },
  {
    id: "2",
    maDon: "HD002",
    ban: "Bàn 3",
    tongTien: 75000,
    trangThai: "Đã thanh toán",
  },
];

export default function NhanVienThuNgan() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setInvoices(fakeInvoices); // Replace with API call in real usage
  }, []);

  const handleConfirmPayment = (id: string) => {
    setInvoices((prev) =>
      prev.map((item) =>
        item.id === id && item.trangThai === "Chờ thanh toán"
          ? { ...item, trangThai: "Đã thanh toán" }
          : item
      )
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Title */}
      <TitleDesc
        title="Thu ngân"
        description="Xem danh sách hóa đơn và xác nhận thanh toán"
        className="col-span-12"
      />

      <div className="col-span-12">
        <Card>
          <CardHeader header="Danh sách hóa đơn" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium text-sm">
                  <tr>
                    <th className="px-4 py-2">Mã đơn</th>
                    <th className="px-4 py-2">Bàn</th>
                    <th className="px-4 py-2">Tổng tiền</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((item , index) => (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-4 py-2">{item.maDon}</td>
                      <td className="px-4 py-2">{item.ban}</td>
                      <td className="px-4 py-2">{item.tongTien.toLocaleString()}₫</td>
                      <td className="px-4 py-2">{item.trangThai}</td>
                      <td className="px-4 py-2">
                        {item.trangThai === "Chờ thanh toán" ? (
                          <button
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={() => handleConfirmPayment(item.id)}
                          >
                            Xác nhận
                          </button>
                        ) : (
                          <span className="text-gray-500 italic">Đã thanh toán</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
