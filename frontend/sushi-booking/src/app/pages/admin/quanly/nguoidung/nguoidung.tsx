"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import TitleDesc from "../../../../components/ui/titleDesc";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Customer } from "../../../../types/customer";
import Pagination from "../../../../components/ui/Panigation";
import {
  FaEye,
  FaLock,
  FaPenFancy,
  FaUser,
  FaUsers,
  FaCashRegister,
} from "react-icons/fa";
import { PiChefHat } from "react-icons/pi";
import PopupNotification from "../../../../components/ui/PopupNotification";
import SearchInput from "@/src/app/components/ui/SearchInput";
import Popup from "../../../../components/ui/Popup";
import InputField from "../../../../components/ui/InputField";
import { Button } from "../../../../components/ui/button";
import Cookies from "js-cookie";

export default function QuanLyNguoiDung() {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<Customer[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [popupContent, setPopupContent] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error",
  });
  const [userPage, setUserPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/customers") // sửa lại URL nếu khác
      .then((res) => {
        console.log("Danh sách người dùng:", res.data);
        setUsers(res.data);
      })
      .catch((err) => console.error("Lỗi khi lấy users:", err));
  }, []);

  // Phân trang dữ liệu
  const paginate = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  // Lấy dữ liệu người dùng hiện tại theo trang
  const currentUsers = paginate(users, userPage);

  const toggleUserStatus = async (user: Customer) => {
    const newStatus = user.status === 1 ? 0 : 1;

    try {
      const res = await axios.put(
        `http://localhost:8000/api/customers/${user.id}/status`,
        {
          status: newStatus,
        }
      );
      const updatedUser = res.data.customer;

      // Cập nhật lại danh sách user tại local state
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setPopupContent({
        title:
          newStatus === 1
            ? "Mở khóa tài khoản thành công."
            : "Khóa tài khoản thành công.",
        message: res.data.message,
        type: "success",
      });
      setPopupOpen(true);
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      setPopupContent({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi cập nhật trạng thái người dùng.",
        type: "error",
      });
      setPopupOpen(true);
    }
  };

  const openEditRolePopup = (user: Customer) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setEditPopupOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const token = Cookies.get("access_token"); // Lấy từ cookie
      if (!token) {
        throw new Error("Không tìm thấy access_token");
      }

      const res = await axios.put(
        `http://localhost:8000/api/customers/${selectedUser.id}/role`,
        { role: selectedRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data.customer;
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

      setPopupContent({
        title: "Cập nhật vai trò thành công",
        message: "Vai trò người dùng đã được cập nhật.",
        type: "success",
      });
      setPopupOpen(true);
      setEditPopupOpen(false);
    } catch (err) {
      console.error("Lỗi cập nhật vai trò:", err);
      setPopupContent({
        title: "Lỗi",
        message: "Không thể cập nhật vai trò người dùng.",
        type: "error",
      });
      setPopupOpen(true);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <PopupNotification
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupContent.title}
        type={popupContent.type}
      >
        <p>{popupContent.message}</p>
      </PopupNotification>
      {/* Header */}
      <TitleDesc
        title="Quản lý người dùng"
        description="Xem và quản lý tất cả người dùng, nhân viên, quản lý"
        className="col-span-12"
      />

      <div className="col-span-12">
        {/* Filters */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Hạng
                </label>
                <select className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors">
                  <option>Tất cả hạng</option>
                  <option>Bạc</option>
                  <option>Vàng</option>
                  <option>Bạch kim</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Vai trò
                </label>
                <select className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors">
                  <option>Tất cả vai trò</option>
                  <option>Người dùng</option>
                  <option>Quản trị viên</option>
                  <option>Nhân viên bếp</option>
                  <option>Nhân viên bàn</option>
                  <option>Nhân viên thu ngân</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Trạng thái
                </label>
                <select className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors">
                  <option>Tất cả trạng thái</option>
                  <option>Đang hoạt động</option>
                  <option>Chưa kích hoạt</option>
                  <option>Bị khóa</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                  Lọc dữ liệu
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      {/* <div className="col-span-12 grid grid-cols-12 gap-4">
        {[
          { label: "Tổng số khách hàng", value: users.length, },
          { label: "Tổng số nhân viên bếp", value: users.filter(user => user.role === 'kitchenmanager').length },
          { label: "Tổng số nhân viên bàn", value: users.filter(user => user.role === 'menumanager').length },
          { label: "Tổng số nhân viên thu ngân", value: users.filter(user => user.role === 'ordermanager').length },
        ].map((item, i) => (
          <Card className="col-span-3" key={i}>
            <CardContent>
              <p className="text-base text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div> */}
      {/* Stats */}
      <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Tổng số khách hàng",
            value: users.length,
            icon: <FaUser className="w-6 h-6" />,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Nhân viên bếp",
            value: users.filter((user) => user.role === "kitchenmanager")
              .length,
            icon: <PiChefHat className="w-6 h-6" />,
            color: "from-green-500 to-green-600",
          },
          {
            label: "Nhân viên bàn",
            value: users.filter((user) => user.role === "menumanager").length,
            icon: <FaUsers className="w-6 h-6" />,
            color: "from-purple-500 to-purple-600",
          },
          {
            label: "Nhân viên thu ngân",
            value: users.filter((user) => user.role === "ordermanager").length,
            icon: <FaCashRegister className="w-6 h-6" />,
            color: "from-orange-500 to-orange-600",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${item.color} text-white`}
                >
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="col-span-12">
        <Card>
          <CardHeader
            header="Danh sách người dùng"
            className="flex justify-between items-center"
          >
            <div className="flex gap-2">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#fff8f1] text-[#5c4033] font-medium text-sm">
                  <tr>
                    <th className=" px-4 py-2">Id</th>
                    <th className=" px-4 py-2">Tên người dùng</th>
                    <th className=" px-4 py-2">Email</th>
                    <th className=" px-4 py-2">Số điện thoại</th>
                    <th className=" px-4 py-2">Điểm</th>
                    <th className=" px-4 py-2">Hạng</th>
                    <th className=" px-4 py-2">Vai trò</th>
                    <th className=" px-4 py-2">Trạng thái</th>
                    <th className=" px-4 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user: Customer, index) => (
                    <tr
                      key={user.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                    >
                      <td className=" px-4 py-2">{user.id}</td>
                      <td className=" px-4 py-2">{user.name}</td>
                      <td className=" px-4 py-2">{user.email}</td>
                      <td className=" px-4 py-2">{user.phone}</td>
                      <td className=" px-4 py-2">{user.point}</td>
                      <td
                        className={` px-4 py-2 
                        ${
                          user.membership_level === "silver"
                            ? "text-gray-400"
                            : user.membership_level === "gold"
                            ? "text-yellow-600"
                            : user.membership_level === "platinum"
                            ? "text-gray-800"
                            : "Không xác định"
                        }`}
                      >
                        {user.membership_level === "silver"
                          ? "Bạc"
                          : user.membership_level === "gold"
                          ? "Vàng"
                          : user.membership_level === "platinum"
                          ? "Bạch kim"
                          : "Chưa có hạng"}
                      </td>
                      <td
                        className={`px-4 py-2 
                        ${
                          user.role === "admin"
                            ? "text-red-600"
                            : user.role === "user"
                            ? "text-blue-600"
                            : user.role === "kitchenmanager"
                            ? "text-orange-600"
                            : user.role === "ordermanager"
                            ? "text-green-600"
                            : user.role === "menumanager"
                            ? "text-purple-600"
                            : "Không xác định"
                        }`}
                      >
                        {user.role === "admin"
                          ? "Quản trị viên"
                          : user.role === "user"
                          ? "Người dùng"
                          : user.role === "kitchenmanager"
                          ? "NV bếp"
                          : user.role === "ordermanager"
                          ? "NV đơn hàng"
                          : user.role === "menumanager"
                          ? "NV thực đơn"
                          : "Không xác định"}
                      </td>
                      <td
                        className={`p-2 font-medium ${
                          user.status === 0 ? "text-red-700" : "text-green-700"
                        }`}
                      >
                        {user.status === 0 ? "Đã khóa" : "Đang hoạt động"}
                      </td>
                      <td className="px-4 py-2 flex gap-1">
                        <button
                          className="p-2 flex items-center gap-1 text-red-700 cursor-pointer border border-red-700 rounded hover:bg-red-100"
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.status === 1 ? <FaLock /> : <FaEye />}
                        </button>
                        <button
                          className="p-2 flex items-center gap-1 text-sm text-blue-700 border border-blue-700 rounded hover:bg-blue-100 font-semibold"
                          onClick={() => openEditRolePopup(user)}
                        >
                          <FaPenFancy />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={userPage}
                totalItems={users.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setUserPage}
              />
            </div>
          </CardContent>
        </Card>
        <Popup
          isOpen={editPopupOpen}
          onClose={() => setEditPopupOpen(false)}
          title="Chỉnh sửa vai trò người dùng"
        >
          <div className="space-y-4">
            {selectedUser && (
              <>
                <InputField
                  label="Tên"
                  name="name"
                  value={selectedUser.name}
                  disabled
                />
                <InputField
                  label="Email"
                  name="email"
                  value={selectedUser.email}
                  disabled
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="kitchenmanager">Nhân viên bếp</option>
                    <option value="menumanager">Nhân viên bàn</option>
                    <option value="ordermanager">Nhân viên đơn hàng</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    onClick={() => setEditPopupOpen(false)}
                  >
                    Huỷ
                  </Button>
                  <Button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleUpdateRole}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </>
            )}
          </div>
        </Popup>
      </div>
    </div>
  );
}
