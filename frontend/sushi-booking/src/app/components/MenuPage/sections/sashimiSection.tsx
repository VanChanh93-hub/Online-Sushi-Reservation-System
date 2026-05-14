"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SashimiItem {
  id: number;
  name: string;
  jpName?: string;
  price: number;
  pieces?: string;
  desc?: string;
  image?: string | null;
}

interface RawGroup {
  group_id: number;
  group_name: string;
  foods: unknown[];
}

interface RawFood {
  id: number;
  name: string;
  jpName?: string;
  price: string | number;
  description?: string;
  image?: string;
}

interface SashimiGroup {
  name: string;
  items: SashimiItem[];
}

export default function SashimiSection() {
  const [groups, setGroups] = useState<SashimiGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPriceVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          "http://127.0.0.1:8000/api/foods/category/2/groups"
        );

        const raw: RawGroup[] = Array.isArray(resp.data.data)
          ? resp.data.data
          : [];

        const mapped: SashimiGroup[] = raw.map((group) => ({
          name: group.group_name,
          items: Array.isArray(group.foods)
            ? group.foods.map((f) => {
                const food = f as RawFood;
                return {
                  id: food.id,
                  name: food.name,
                  jpName: food.jpName,
                  price:
                    typeof food.price === "string"
                      ? parseFloat(food.price)
                      : food.price,
                  pieces: group.group_id === 1 ? food.description : undefined,
                  desc: group.group_id !== 1 ? food.description : undefined,
                  image: food.image ?? null,
                };
              })
            : [],
        }));

        setGroups(mapped);
      } catch (err) {
        console.error("Lỗi khi tải sashimi:", err);
        setError("Không thể tải dữ liệu sashimi.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <section id="sashimi" className="py-16 px-6 md:px-16 lg:px-24 bg-white">
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
              Sashimi
            </h2>
            <div className="h-px w-16 bg-[#999]" />
          </div>
          <p className="text-[#666] text-base md:text-lg mt-2">
            Cá tươi ngon được cắt lát mỏng tinh tế, chuẩn phong cách Nhật Bản
          </p>
        </motion.div>

        {loading ? (
          <p className="text-center text-gray-600">Đang tải sashimi...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : groups.length === 0 ? (
          <p className="text-center text-gray-500">Không có sashimi nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {groups.map((group) => (
              <div key={group.name}>
                <h3 className="text-xl md:text-2xl font-semibold text-[#333] mb-4 pb-2 border-b border-[#ccc]">
                  {group.name}
                </h3>

                {group.name === "Sashimi đơn lẻ" ? (
                  <div className="space-y-5">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b border-dashed pb-3"
                      >
                        <div>
                          <div className="text-base font-medium text-[#333] flex items-center gap-1">
                            {item.name}
                            {item.jpName && (
                              <span className="text-xs italic text-[#666]">
                                ({item.jpName})
                              </span>
                            )}
                          </div>
                          {item.pieces && (
                            <p className="text-sm text-[#888] italic">
                              {item.pieces}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#D64B4B]">
                            {formatPriceVND(item.price)}
                          </span>
                          <button className="bg-[#A68345] hover:bg-[#8D6B32] text-white text-sm px-3 py-1 rounded-full transition">
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                      >
                        <div className="w-1/3 h-40 relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
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
                              {formatPriceVND(item.price)}
                            </span>
                            <button className="bg-[#A68345] hover:bg-[#8D6B32] text-white text-sm px-4 py-2 rounded-md transition">
                              Đặt món
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
