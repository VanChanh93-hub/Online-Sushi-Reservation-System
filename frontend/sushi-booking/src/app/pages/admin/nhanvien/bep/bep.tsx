"use client";
import React, { useEffect, useState } from 'react';
import TitleDesc from "../../../../components/ui/titleDesc";
import { Card, CardContent, CardHeader } from '../../../../components/ui/Card';
import SearchInput from '../../../../components/ui/SearchInput';

type OrderItem = {
  id: string;
  maDon: string;
  tenMon: string;
  soLuong: number;
  ban: string;
  trangThai: 'Chờ xử lý' | 'Đang chuẩn bị' | 'Đã hoàn thành';
};

const fakeData: OrderItem[] = [
  {
    id: '1',
    maDon: 'HD001',
    tenMon: 'Phở bò',
    soLuong: 2,
    ban: 'Bàn 1',
    trangThai: 'Chờ xử lý',
  },
  {
    id: '2',
    maDon: 'HD002',
    tenMon: 'Cơm gà',
    soLuong: 1,
    ban: 'Bàn 3',
    trangThai: 'Đang chuẩn bị',
  },
];

export default function NhanVienBep() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setOrders(fakeData); // Replace with API call
  }, []);

  const handleUpdateStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              trangThai:
                item.trangThai === 'Chờ xử lý'
                  ? 'Đang chuẩn bị'
                  : item.trangThai === 'Đang chuẩn bị'
                  ? 'Đã hoàn thành'
                  : item.trangThai,
            }
          : item
      )
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4 bg-[#fff8f0]">
        {/* Title */}
        <TitleDesc
            title="Quản lý bàn"
            description="Xem và quản lý tất cả đơn hàng"
            className="col-span-12"
        />
        <div className="col-span-12">
            <Card>
                <CardHeader header="Danh sách món ăn" className="flex justify-between items-center">
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
                            {orders.map((item) => (
                                <tr key={item.id} className="border-b">
                                <td className="px-4 py-2">{item.maDon}</td>
                                <td className="px-4 py-2">{item.tenMon}</td>
                                <td className="px-4 py-2">{item.soLuong}</td>
                                <td className="px-4 py-2">{item.ban}</td>
                                <td className="px-4 py-2">{item.trangThai}</td>
                                <td>
                                    {item.trangThai !== 'Đã hoàn thành' && (
                                    <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleUpdateStatus(item.id)}
                                    >
                                        Cập nhật
                                    </button>
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
