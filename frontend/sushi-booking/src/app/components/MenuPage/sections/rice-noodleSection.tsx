"use client";

import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface FoodItem {
  id: number;
  name: string;
  jpName: string;
  price: string | number;
  desc: string;
  image: string;
}

interface FoodGroup {
  group_id: number;
  group_name: string;
  foods: FoodItem[];
}

export default function RiceNoodlesSection() {
  const [groups, setGroups] = useState<FoodGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Hàm định dạng giá tiền Việt Nam
  const formatPriceVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://127.0.0.1:8000/api/foods/category/4/groups"
        );
        const result = await res.json();
        if (result.type === "group") {
          setGroups(result.data);
        } else {
          setError("Dữ liệu không hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setError("Không thể tải dữ liệu cơm & mì.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  return (
    <section id="rice" className="py-16 px-6 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-16 bg-[#999]" />
            <h2 className="text-2xl md:text-4xl font-semibold tracking-wider text-[#3D3D3D] flex items-center gap-2">
              <ChefHat className="text-[#A68345]" size={28} />
              Cơm & Mì
            </h2>
            <div className="h-px w-16 bg-[#999]" />
          </div>
          <p className="text-[#666] text-base md:text-lg mt-2">
            Các món cơm và mì truyền thống Nhật Bản
          </p>
        </motion.div>

        {loading ? (
          <p className="text-center text-gray-600">Đang tải cơm & mì...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : groups.length === 0 ? (
          <p className="text-center text-gray-500">Không có món nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {groups.map((group) => (
              <div key={group.group_id}>
                <h3 className="text-xl md:text-2xl font-semibold text-[#333] mb-4 pb-2 border-b border-[#ccc]">
                  {group.group_name}
                </h3>

                <div className="space-y-6">
                  {group.foods.map((item) => (
                    <div
                      key={item.id}
                      className="flex bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-1/3 h-40 object-cover"
                      />
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-[#333]">
                            {item.name}
                            {item.jpName && (
                              <span className="ml-1 text-sm text-[#666]">
                                ({item.jpName})
                              </span>
                            )}
                          </h4>
                          {item.desc && (
                            <p className="text-sm text-[#777] mt-1 italic">
                              {item.desc}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-bold text-[#D64B4B]">
                            {formatPriceVND(
                              typeof item.price === "string"
                                ? parseFloat(item.price)
                                : item.price
                            )}
                          </span>
                          <button className="bg-[#A68345] hover:bg-[#8D6B32] text-white text-sm px-4 py-2 rounded-md transition">
                            Đặt món
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
