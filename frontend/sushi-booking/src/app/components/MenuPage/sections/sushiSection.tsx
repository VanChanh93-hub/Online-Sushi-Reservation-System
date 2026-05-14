"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";

interface MenuItem {
  name: string;
  jpName?: string;
  price: string | number;
  desc?: string;
}

interface MenuGroup {
  name: string;
  items: MenuItem[];
}

interface SushiItemAPI {
  name: string;
  jpName?: string;
  price: string | number;
  description?: string;
}

interface SushiGroupAPI {
  group_name: string;
  foods: unknown[];
}

export default function SushiSection() {
  const [groups, setGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPriceVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          "http://127.0.0.1:8000/api/foods/category/5/groups"
        );
        const rawData = Array.isArray(resp.data)
          ? resp.data
          : resp.data?.data || [];

        const transformedData: MenuGroup[] = rawData.map(
          (groupRaw: SushiGroupAPI) => {
            return {
              name: groupRaw.group_name || "Không tên",
              items: Array.isArray(groupRaw.foods)
                ? groupRaw.foods.map((foodRaw: unknown) => {
                    const food = foodRaw as SushiItemAPI;
                    return {
                      name: food.name,
                      jpName: food.jpName,
                      price: food.price,
                      desc: food.description,
                    };
                  })
                : [],
            };
          }
        );

        setGroups(transformedData);
      } catch (err) {
        console.error("Lỗi khi tải sushi:", err);
        setError("Không thể tải dữ liệu sushi.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    console.log("Thêm vào giỏ hàng:", item);
    // TODO: gọi API hoặc lưu vào context/store
  };

  return (
    <section id="sushi" className="py-16 px-4 sm:px-10 lg:px-24 bg-[#F8F1E9]">
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
              Sushi
            </h2>
            <div className="h-px w-12 md:w-24 bg-[#555]" />
          </div>
          <p className="text-[#666] text-sm md:text-base mt-2">
            Mỗi miếng sushi được làm thủ công bởi đầu bếp sushi của chúng tôi
          </p>
          <p className="text-[#666] text-sm md:text-base mt-2">
            Giá cho 2 miếng (nigiri)
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-[#A68345] animate-pulse">
            Đang tải sushi...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {groups.map((group) => (
              <div
                key={group.name}
                className="space-y-4 border-b-2 border-dashed border-[#ccc] pb-8"
              >
                <h3 className="text-xl font-semibold text-[#333] border-b border-[#999] pb-2 mb-3">
                  {group.name}
                </h3>
                <ul className="space-y-4">
                  {group.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-start border-b border-dashed border-[#e2e2e2] pb-3"
                    >
                      <div className="w-[75%]">
                        <span className="text-[#333] font-medium">
                          {item.name}
                        </span>
                        {item.jpName && (
                          <span className="text-sm text-[#777] ml-2 italic">
                            ({item.jpName})
                          </span>
                        )}
                        {item.desc && (
                          <p className="text-xs text-[#666] italic mt-1">
                            {item.desc}
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
