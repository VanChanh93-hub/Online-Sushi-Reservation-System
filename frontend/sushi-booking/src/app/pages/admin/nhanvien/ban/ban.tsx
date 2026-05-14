"use client";
import React, { useEffect, useState } from "react";
// import TitleDesc from "../../../..components/ui/titleDesc";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import TitleDesc from "../../../../components/ui/titleDesc";
import SearchInput from "../../../../components/ui/SearchInput";

type TableOrderItem = {
  id: string;
  maDon: string;
  tenMon: string;
  soLuong: number;
  ban: string;
  trangThai: 'Đang chuẩn bị' | 'Đã hoàn thành' | 'Đã giao xong';
};

const fakeDataTable: TableOrderItem[] = [
  {
    id: '1',
    maDon: 'HD001',
    tenMon: 'Phở bò',
    soLuong: 2,
    ban: 'Bàn 1',
    trangThai: 'Đã hoàn thành',
  },
  {
    id: '2',
    maDon: 'HD002',
    tenMon: 'Cơm gà',
    soLuong: 1,
    ban: 'Bàn 3',
    trangThai: 'Đã giao xong',
  },
];

export default function NhanVienBan() {
  const [orders, setOrders] = useState<TableOrderItem[]>([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    setOrders(fakeDataTable); // Replace with API call
  }, []);

  const handleUpdateStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id && item.trangThai === 'Đã hoàn thành'
          ? { ...item, trangThai: 'Đã giao xong' }
          : item
      )
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4 bg-[#f0fbff]">
      <TitleDesc
        title="Phục vụ bàn"
        description="Xem các món ăn đã sẵn sàng và cập nhật trạng thái sau khi phục vụ"
        className="col-span-12"
      />

      <div className="col-span-12">
        <Card>
          <CardHeader header="Danh sách món ăn từ bếp" className="flex justify-between items-center">
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
                    <th className="px-4 py-2">Tên món</th>
                    <th className="px-4 py-2">Số lượng</th>
                    <th className="px-4 py-2">Bàn</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                      <td className="px-4 py-2">{item.maDon}</td>
                      <td className="px-4 py-2">{item.tenMon}</td>
                      <td className="px-4 py-2">{item.soLuong}</td>
                      <td className="px-4 py-2">{item.ban}</td>
                      <td className="px-4 py-2">{item.trangThai}</td>
                      <td className="px-4 py-2">
                        {item.trangThai === 'Đã hoàn thành' && (
                          <button
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={() => handleUpdateStatus(item.id)}
                          >
                            Đã giao xong
                          </button>
                        )}
                        {item.trangThai === 'Đã giao xong' && (
                          <span className="text-gray-500 italic">Hoàn tất</span>
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
