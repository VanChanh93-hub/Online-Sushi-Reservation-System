"use client";

import { useEffect, useState } from "react";
import { StarIcon, HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useTranslation } from "../../lib/i18n/client";

interface CardItem {
  id: number;
  name: string;
  name_en?: string;
  price: number;
  image?: string;
  type: string;
  rating?: number;
  description?: string;
  description_en?: string;
}

interface CardListProps {
  data: CardItem[];
  filterType: string;
}

export default function CardList({ data, filterType }: CardListProps) {
  const [filteredItems, setFilteredItems] = useState<CardItem[]>([]);
  const { lang, t } = useTranslation("product");

  useEffect(() => {
    const filtered =
      filterType === "all"
        ? data
        : data.filter((item) => item.type === filterType);
    setFilteredItems(filtered);
  }, [filterType, data]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {filteredItems.map((item) => {
          const displayName =
            lang === "en" ? item.name_en || item.name : item.name;
          const displayDescription =
            lang === "en"
              ? item.description_en || item.description
              : item.description;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-visible h-70 flex flex-col cursor-pointer group"
            >
              <div className="relative h-40">
                <div className="absolute right-5 -top-6 w-50 h-50 rounded-full border-4 border-white shadow-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={displayName}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute top-3 left-5 flex gap-2">
                  <button className="bg-white p-1 rounded-full shadow">
                    <HeartIcon className="h-5 w-5 text-red-500" />
                  </button>
                  <div className="bg-white px-2 py-1 rounded-full shadow flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs font-medium ml-1 text-gray-700">
                      {item.rating?.toFixed(1) || "4.5"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#333333] line-clamp-2 mb-1">
                    {displayName}
                  </h3>
                  {displayDescription && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {displayDescription}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4 gap-4">
                  <span className="text-red-600 font-bold text-xl flex-1">
                    {Number(item.price).toLocaleString("vi-VN")} VNĐ
                  </span>
                  <button className="bg-[#AF763E] text-white px-4 py-2 rounded-[30px] hover:bg-[#8a5c3a] transition text-sm whitespace-nowrap">
                    {t("add_to_cart")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
