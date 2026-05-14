"use client";
import { FaPlus, FaPen, FaEyeSlash } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardContent,
} from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import { useFetch } from "../../../../../hooks/useFetch";
import usePagination from "@/src/app/hooks/usePagination";
import Pagination from "../../../../../components/ui/Panigation";
import SearchInput from "../../../../../components/ui/SearchInput";
import React, { useState } from "react";
import Popup from "../../../../../components/ui/Popup";
import InputField from "../../../../../components/ui/InputField";
import { addFoodGroup } from "../../../../../hooks/useAdd";
import { FoodGroupAdd } from "../../../../../types/foodgroup";
import { Category } from "../../../../../types/category";

export default function GroupFoodComponent({
  groupRef,
}: {
  groupRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [searchText, setSearchText] = useState("");
  const { foodGroups, categories } = useFetch(); // lấy category cho form
  const {
    currentPage,
    setCurrentPage,
    currentData: currentFoodGroups,
    totalItems,
    itemsPerPage,
  } = usePagination(foodGroups, 10);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FoodGroupAdd>({
    name: "",
    category_id: 0,
  });

  const handleOpenPopup = () => setIsOpen(true);
  const handleClosePopup = () => {
    setIsOpen(false);
    setFormData({ name: "", category_id: 0 });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "category_id" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addFoodGroup(formData);
      handleClosePopup();
      window.location.reload(); // hoặc refetch nếu bạn có support
    } catch (error) {
      console.error("Lỗi khi thêm loại danh mục:", error);
    }
  };

  return (
    <div className="col-span-12" ref={groupRef}>
      <Card>
        <CardHeader
          header="Danh sách loại danh mục"
          className="flex justify-between items-center"
        >
          <div className="flex gap-2 w-full max-w-md">
            <SearchInput value={searchText} onChange={setSearchText} />
          </div>
          <Button
            onClick={handleOpenPopup}
            className="bg-[#f3eae4] text-[#9c6b66] px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer"
          >
            <FaPlus /> Thêm loại danh mục
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Tên loại danh mục</th>
                <th className="px-4 py-2">Danh mục</th>
                <th className="px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentFoodGroups.map((cate, index) => (
                <tr
                  key={cate.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}
                >
                  <td className="px-4 py-2">{cate.id}</td>
                  <td className="px-4 py-2">{cate.name}</td>
                  <td className="px-4 py-2">{cate.category?.name}</td>
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

      {/* POPUP */}
      <Popup
        isOpen={isOpen}
        onClose={handleClosePopup}
        title="Thêm loại danh mục"
      >
        <form className="space-y-4">
          <InputField
            label="Tên loại danh mục"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Danh mục cha
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                -- Chọn danh mục --
              </option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={handleClosePopup}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="px-4 py-2 bg-[#9c6b66] text-white rounded hover:bg-[#7e544f]"
              onClick={handleSubmit}
            >
              Thêm
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  );
}
