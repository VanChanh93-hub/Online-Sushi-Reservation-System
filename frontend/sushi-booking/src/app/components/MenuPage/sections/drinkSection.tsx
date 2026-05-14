"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";

interface FoodItem {
  name: string;
  price: string | number;
  bottle?: string;
  description?: string;
}

interface Group {
  group_id: number;
  group_name: string;
  foods: FoodItem[];
}

export default function DrinksSection() {
  const [drinkGroups, setDrinkGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Hàm format giá VND
  const formatPriceVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://127.0.0.1:8000/api/foods/category/6/groups"
        );
        setDrinkGroups(res.data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu đồ uống:", error);
        setError("Không thể tải dữ liệu đồ uống.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  const handleAddToCart = (item: FoodItem) => {
    console.log("Thêm vào giỏ hàng:", item);
    // TODO: lưu vào context/store hoặc gọi API thêm giỏ hàng
  };

  return (
    <section id="drinks" className="py-16 px-4 sm:px-10 lg:px-24 bg-[#F8F1E9]">
      <div className="container mx-auto max-w-8xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 md:gap-5 mb-2">
            <div className="h-px w-12 md:w-24 bg-[#555]" />
            <h2 className="text-xl md:text-3xl font-bold uppercase tracking-wider text-[#444] flex items-center gap-2">
              <ChefHat className="text-[#A68345]" size={24} />
              Đồ uống
            </h2>
            <div className="h-px w-12 md:w-24 bg-[#555]" />
          </div>
          <p className="text-[#666] text-sm md:text-base mt-2">
            Thức uống truyền thống và hiện đại của Nhật Bản
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-[#A68345] animate-pulse">
            Đang tải đồ uống...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {drinkGroups.map((group) => (
              <div
                key={group.group_id}
                className="space-y-4 border-b-2 border-dashed border-[#ccc] pb-8"
              >
                <h3 className="text-xl font-semibold text-[#333] border-b border-[#999] pb-2 mb-3">
                  {group.group_name}
                </h3>
                <ul className="space-y-4">
                  {group.foods.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-start border-b border-dashed border-[#e2e2e2] pb-3"
                    >
                      <div className="w-[75%]">
                        <span className="text-[#333] font-medium">
                          {item.name}
                        </span>
                        {item.bottle && (
                          <span className="text-sm text-[#777] ml-2 italic">
                            ({item.bottle})
                          </span>
                        )}
                        {item.description && (
                          <p className="text-xs text-[#666] italic mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 text-[#A83D3D] font-bold text-base">
                        <span>
                          {formatPriceVND(
                            typeof item.price === "string"
                              ? parseFloat(item.price)
                              : item.price
                          )}
                        </span>
                        <button
                          className="bg-[#A68345] hover:bg-[#8D6B32] text-white text-sm px-3 py-1 rounded-full transition"
                          onClick={() => handleAddToCart(item)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
