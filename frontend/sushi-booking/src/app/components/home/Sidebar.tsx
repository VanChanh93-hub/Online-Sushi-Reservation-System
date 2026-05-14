"use client";
import React, { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const menuItems = [
    {
      key: "dashboard",
      label: "Tổng quan",
      href: "/tong-quan",
    },
    {
      key: "quanly",
      label: "Quản lý",
      children: [
        {
          key: "nguoidung",
          label: "Quản lý người dùng",
          href: "/quan-ly/nguoi-dung",
        },
        {
          key: "thucdon",
          label: "Quản lý thực đơn",
          href: "/quan-ly/thuc-don",
        },
        {
          key: "ban",
          label: "Quản lý bàn",
          href: "/quan-ly/ban",
        },
        {
          key: "donhang",
          label: "Quản lý đơn hàng",
          href: "/quan-ly/don-hang",
        },
        // {
        //   key: "datmon",
        //   label: "Quản lý đặt món",
        //   href: "/quan-ly/dat-mon",
        // },
        {
          key: "khuyenmai",
          label: "Quản lý voucher",
          href: "/quan-ly/khuyen-mai",
        },
      ],
    },
    {
      key: "nhanvien",
      label: "Nhân viên",
      children: [
        { key: "bep", label: "Nhân viên bếp", href: "/nhan-vien/bep" },
        { key: "ban", label: "Nhân viên bàn", href: "/nhan-vien/ban" },
        { key: "thungan", label: "Thu ngân", href: "/nhan-vien/thu-ngan" },
      ],
    },
  ];

  const renderMenu = (items: any[], level = 0) => {
    return items.map((item) => {
      const isOpen = openMenus.includes(item.key);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.key} className={`pl-${level * 4}`}>
          <div
            className={`flex items-center justify-between px-2 py-2 text-base text-black rounded hover:bg-gray-300 cursor-pointer`}
            onClick={() => (hasChildren ? toggleMenu(item.key) : null)}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              {item.href ? (
                <Link href={`/quan-tri${item.href}`}>
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </div>
            {hasChildren && (
              <span className="text-sm">{isOpen ? "▾" : "▸"}</span>
            )}
          </div>
          {hasChildren && isOpen && (
            <div className="ml-4">{renderMenu(item.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <aside className="w-64 min-h-screen bg-white text-black p-4 hidden md:block">
      <div className="text-2xl font-bold mb-6">Trang Admin</div>
      <nav>{renderMenu(menuItems)}</nav>
    </aside>
  );
};

export default Sidebar;
