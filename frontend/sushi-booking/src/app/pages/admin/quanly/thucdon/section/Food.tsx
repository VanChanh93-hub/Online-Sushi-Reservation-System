"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaPen, FaEyeSlash } from "react-icons/fa";
import { Card, CardHeader, CardContent } from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import { useFetch } from "../../../../../hooks/useFetch";
import usePagination from "@/src/app/hooks/usePagination";
import Pagination from "../../../../../components/ui/Panigation";
import Image from "next/image";
import SearchInput from "../../../../../components/ui/SearchInput";
import { FoodAdd } from "@/src/app/types";
import Popup from "@/src/app/components/ui/Popup";
import InputField from "@/src/app/components/ui/InputField";
import { addFood } from "@/src/app/hooks/useAdd";

export default function FoodComponent({
  foodRef,
}: {
  foodRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [searchText, setSearchText] = useState("");
  const { foods, categories, foodGroups } = useFetch();

  const {
    currentPage,
    setCurrentPage,
    currentData: currentFood,
    totalItems,
    itemsPerPage,
  } = usePagination(foods, 10);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newFood, setNewFood] = useState<FoodAdd>({
    name: "",
    category_id: 0,
    group_id: undefined,
    jpName: "",
    description: "",
    price: 0,
    image: undefined,
  });

  const [filteredGroups, setFilteredGroups] = useState<typeof foodGroups>([]);

  useEffect(() => {
    if (!newFood.category_id || !foodGroups) {
      setFilteredGroups([]);
      return;
    }

    const related = foodGroups.filter(
      (group) => group.category?.id === newFood.category_id
    );
    setFilteredGroups(related);
    setNewFood((prev) => ({ ...prev, group_id: undefined }));
  }, [newFood.category_id, foodGroups]);

  return (
    <div className="col-span-12" ref={foodRef}>
      <Card>
        <CardHeader header="Danh sách món ăn" className="flex justify-between items-center">
          <div className="flex gap-2 w-full max-w-md">
            <SearchInput value={searchText} onChange={setSearchText} />
          </div>
          <Button
            className="bg-[#9c6b66] text-white px-3 py-1 rounded flex items-center gap-2 text-base cursor-pointer"
            onClick={() => setIsPopupOpen(true)}
          >
            <FaPlus /> Thêm món ăn
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff8f1] text-[#5c4033] font-medium">
                <tr>
                  <th className="px-4 py-2">STT</th>
                  <th className="px-4 py-2">Hình ảnh</th>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Tên Nhật</th>
                  <th className="px-4 py-2">Loại danh mục</th>
                  <th className="px-4 py-2">Danh mục</th>
                  <th className="px-4 py-2">Giá</th>
                  <th className="px-4 py-2">Mùa</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentFood.map((food, index) => (
                  <tr key={food.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
                    <td className="px-4 py-2">{food.id}</td>
                    <td className="px-4 py-2">
                      {food.image && (
                        <Image
                          src={`${food.image}`}
                          alt={food.name}
                          width={200}
                          height={200}
                          className="w-[50px] h-[50px] object-cover mx-auto rounded"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2">{food.name}</td>
                    <td className="px-4 py-2">{food.jpName || "Không có tên nhật"}</td>
                    <td className="px-4 py-2">{food.group?.name ?? "Không có"}</td>
                    <td className="px-4 py-2">{food.category?.name ?? "Không có"}</td>
                    <td className="px-4 py-2">
                      {Number(food.price).toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-4 py-2">{food.season}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          food.status
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {food.status ? "Đang bán" : "Ngưng bán"}
                      </span>
                    </td>
                    <td className="py-2 flex items-center gap-2">
                      <button className="px-1 text-blue-700 border border-blue-700 rounded flex items-center gap-1 hover:bg-blue-100">
                        <FaPen />
                        <span className="text-blue-700 font-semibold">Sửa</span>
                      </button>
                      <button className="px-1 text-red-700 border border-red-700 rounded flex items-center gap-1 hover:bg-red-100">
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
          </div>
        </CardContent>
      </Card>

      {/* Form Thêm món ăn */}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Thêm món ăn">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await addFood(newFood);
              setIsPopupOpen(false);
              window.location.reload();
            } catch (err) {
              console.error("Thêm món ăn lỗi:", err);
            }
          }}
          className="grid grid-cols-2 gap-4"
        >
          <InputField
            label="Tên món"
            name="name"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
          />
          <InputField
            label="Tên Nhật"
            name="jpName"
            value={newFood.jpName || ""}
            onChange={(e) => setNewFood({ ...newFood, jpName: e.target.value })}
          />
          <InputField
            label="Mô tả"
            name="description"
            value={newFood.description || ""}
            onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
          />
          <InputField
            label="Giá"
            name="price"
            type="number"
            value={String(newFood.price)}
            onChange={(e) =>
              setNewFood({ ...newFood, price: parseFloat(e.target.value) })
            }
          />

          {/* Select danh mục */}
          <select
            value={newFood.category_id}
            onChange={(e) =>
              setNewFood({ ...newFood, category_id: Number(e.target.value) })
            }
            className="col-span-2 border px-3 py-2 rounded"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Select loại danh mục (group) */}
          <select
            value={newFood.group_id ?? ""}
            onChange={(e) =>
              setNewFood({ ...newFood, group_id: Number(e.target.value) })
            }
            className="col-span-2 border px-3 py-2 rounded"
            disabled={!filteredGroups.length}
          >
            <option value="">-- Chọn loại danh mục --</option>
            {filteredGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Hình ảnh */}
          <input
            type="file"
            onChange={(e) =>
              setNewFood({ ...newFood, image: e.target.files?.[0] })
            }
            className="col-span-2"
          />

          <div className="col-span-2 flex justify-end gap-2">
            <Button onClick={() => setIsPopupOpen(false)} type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
              Huỷ
            </Button>
            <Button type="submit" className="bg-[#9c6b66] text-white px-4 py-2 rounded hover:bg-[#7e544f]">
              Thêm
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  );
}
