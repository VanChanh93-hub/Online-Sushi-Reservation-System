"use client";

import { FaPlus, FaPen, FaEyeSlash } from "react-icons/fa";
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import {useFetch} from "../../../../../hooks/useFetch";
import usePagination from "@/src/app/hooks/usePagination";
import Pagination from "../../../../../components/ui/Panigation";
import Popup from "@/src/app/components/ui/Popup";
import SearchInput from "../../../../../components/ui/SearchInput";
import React, { useState } from "react";
import InputField from "@/src/app/components/ui/InputField";
import { addCategory } from "@/src/app/hooks/useAdd";
import { useSearchFilter } from "@/src/app/hooks/useSearchFilter";

export default function CategoryComponent({
  categoryRef,
}: {
  categoryRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [searchText, setSearchText] = useState("");
    const { categories } = useFetch();
    const {
        currentPage,
        setCurrentPage,
        currentData: currentCategories,
        totalItems,
        itemsPerPage,
    } = usePagination(categories, 10);
    
    // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => {
    setFormData({ name: "", description: "" });
    setIsPopupOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return alert("Tên danh mục là bắt buộc");
    try {
      setLoading(true);
      await addCategory(formData);
      handleClosePopup();
      window.location.reload();
      // refetch?.(); // Nếu useFetch có hỗ trợ refetch dữ liệu
    } catch (error) {
      alert("Đã có lỗi xảy ra khi thêm danh mục.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="col-span-12" ref={categoryRef}>
        <Card>
          <CardHeader header="Danh sách danh mục" className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <SearchInput value={searchText} onChange={setSearchText} />
            </div>
            <Button
              onClick={handleOpenPopup}
              className="bg-[#9c6b66] text-white px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer"
            >
              <FaPlus /> Thêm danh mục
            </Button>
          </CardHeader>
          <CardContent>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Tên danh mục</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((cate, index) => (
                  <tr
                    key={cate.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                  >
                    <td className="px-4 py-2">{cate.id}</td>
                    <td className="px-4 py-2">{cate.name}</td>
                    <td className="py-2 flex items-center gap-2">
                      <button className="px-1 text-blue-700 cursor-pointer border border-blue-700 rounded flex items-center gap-1 hover:bg-blue-100">
                        <FaPen />
                        <span className="text-blue-700 font-semibold">Sửa</span>
                      </button>
                      <button className="px-1 text-red-700 cursor-pointer border border-red-700 rounded flex items-center gap-1 hover:bg-red-100">
                        <FaEyeSlash />
                        <span className="text-red-700 font-semibold">Ẩn</span>
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
        {/* Popup Thêm danh mục */}
        <Popup isOpen={isPopupOpen} onClose={handleClosePopup} title="Thêm danh mục">
          <div className="flex flex-col gap-4">
            <InputField
              label="Tên danh mục"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <div className="flex justify-end mt-4 gap-2">
              <Button
                onClick={handleClosePopup}
                className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
              >
                Huỷ
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-[#9c6b66] text-white rounded hover:bg-[#7e544f]"
              >
                {loading ? "Đang thêm..." : "Thêm"}
              </Button>
            </div>
          </div>
        </Popup>
      </div>
    );
}