"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { ChefHat, ArrowRight, Search } from "lucide-react";
import CardList from "../ProductCard/cardList";
import Link from "next/link";
import { useTranslation } from "../../lib/i18n/client";
import { usePathname } from "next/navigation";

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

interface Product {
  id: number | string;
  name: string;
  image?: string;
  jpName?: string;
  price: string | number;
  description?: string;
  category?: string;
  category_id?: number;
  rating?: number;
  cookTime?: string;
}

interface CardItem {
  id: number;
  name: string;
  jpName?: string;
  price: number;
  image?: string;
  type: string;
  category_id?: number;
  rating?: number;
  cookTime?: string;
}

export default function Menus() {
  const { t, lang } = useTranslation("menu");
  const pathname = usePathname();

  const categoryIcons: Record<string, string> = {
    [t("categories.all")]: "🍽️",
    [t("categories.sushi")]: "🍣",
    [t("categories.sashimi")]: "🐟",
    [t("categories.maki")]: "🍱",
    [t("categories.tempura")]: "🍤",
    [t("categories.ramen")]: "🍜",
    [t("categories.dessert")]: "🍮",
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getLocalizedPath = (path: string) => {
    return `/${lang}${path}`;
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/category", {
        params: { lang },
      });
      if (Array.isArray(res.data)) {
        const allTab: Category = {
          id: -1,
          name: t("categories.all"),
          icon: "🍽️",
        };
        const final = res.data.map((cat: Category) => ({
          ...cat,
          icon: categoryIcons[cat.name] || "🍽️",
        }));
        setCategories([allTab, ...final]);
      }
    } catch {
      setCategories([]);
    }
  }, [t, lang]);

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/foods", {
        params: { lang },
      });
      let data: Product[] = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data?.data) data = res.data.data;
      const enriched = data.map((p) => ({
        ...p,
        rating: Math.random() * 2 + 3,
        cookTime: `${Math.floor(Math.random() * 20) + 10} ${t("time.minutes")}`,
      }));
      setAllProducts(enriched);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [t, lang]);

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, [fetchCategories, fetchAllProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    if (selectedCategoryId !== -1) {
      filtered = filtered.filter((p) => p.category_id === selectedCategoryId);
    }
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.jpName?.toLowerCase().includes(keyword) ||
          p.description?.toLowerCase().includes(keyword)
      );
    }
    return filtered;
  }, [allProducts, selectedCategoryId, searchTerm]);

  const displayedProducts = filteredProducts.slice(0, 6);

  const cardItems: CardItem[] = displayedProducts.map((item) => ({
    id: typeof item.id === "string" ? parseInt(item.id, 10) : item.id,
    name: item.name,
    jpName: item.jpName,
    price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
    image: item.image,
    type: item.category || "special",
    category_id: item.category_id,
    rating: item.rating,
    cookTime: item.cookTime,
  }));

  return (
    <section className="py-15 px-6 sm:px-16 bg-white text-base text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[#A68345] font-semibold mb-3 text-base">
            <ChefHat size={18} />
            <span>{t("header.subtitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            <span className="block text-[1.1em]">
              {t("header.japanese_title")}
            </span>
            <span className="bg-gradient-to-r from-[#A68345] to-[#BD944A] bg-clip-text text-transparent">
              {t("header.main_title")}
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-4 -mb-5 leading-relaxed">
            {t("header.description")}
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 max-w-lg mx-auto">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68345]"
              size={20}
            />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-xl border border-[#A68345]/20 focus:outline-none focus:border-[#A68345] bg-white text-gray-800 text-base"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-7 py-3 rounded-full border text-base font-medium transition-all duration-200 ${
                selectedCategoryId === cat.id
                  ? "bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white"
                  : "bg-white border-[#A68345]/20 text-gray-800 hover:border-[#A68345]"
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading / No Result / Products */}
        {loading ? (
          <p className="text-center text-[#A68345] text-base">
            {t("states.loading")}
          </p>
        ) : cardItems.length === 0 ? (
          <p className="text-center text-gray-500 text-base">
            {t("states.no_results")}
          </p>
        ) : (
          <CardList data={cardItems} filterType="all" />
        )}

        {/* View All Button */}
        {filteredProducts.length > 6 && (
          <div className="text-center mt-10">
            <Link
              href={getLocalizedPath("/thuc-don")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-base font-semibold"
            >
              <ChefHat size={20} />
              <span>{t("buttons.view_all")}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
