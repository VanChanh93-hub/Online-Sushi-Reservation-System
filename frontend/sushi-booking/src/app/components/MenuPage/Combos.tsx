"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChefHat, Users, Star } from "lucide-react";
import Image from "next/image";

interface Food {
  id: number;
  name: string;
  jpName: string | null;
  image: string | null;
  description: string;
  price: string;
}

interface ComboItem {
  id: number;
  quantity: number;
  food: Food;
}

interface Combo {
  id: number;
  name: string;
  image: string | null;
  description: string;
  price: string;
  combo_items: ComboItem[];
  rating: number;
  serving_size: number;
}

const slideVariants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? 100 : -100,
    opacity: 0,
    position: "absolute" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative" as const,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? -100 : 100,
    opacity: 0,
    position: "absolute" as const,
  }),
};

export default function ComboSlider() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://127.0.0.1:8000/api/combos");
        if (!Array.isArray(res.data)) throw new Error("Invalid data");

        const data = res.data.map((combo: Combo) => ({
          ...combo,
          rating: parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)),
          serving_size: Math.max(
            2,
            Math.min(6, Math.ceil(combo.combo_items.length * 0.6))
          ),
        }));

        setCombos(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải combo. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const nextSlide = () => {
    if (!combos.length) return;
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % combos.length);
  };

  const prevSlide = () => {
    if (!combos.length) return;
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + combos.length) % combos.length);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="h-96 flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-2xl p-8 shadow max-w-md mx-auto">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Đã xảy ra lỗi
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  const combo = combos[currentIndex];

  return (
    <section className="py-16 px-6 sm:px-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12" aria-labelledby="combo-title">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm mb-4">
            <ChefHat className="text-amber-600" size={18} />
            <span className="text-amber-600 font-medium">COMBO ƯU ĐÃI</span>
          </div>
          <h2
            id="combo-title"
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
          >
            Gói Ưu Đãi Đặc Biệt
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Tiết kiệm hơn khi đặt combo cho gia đình và bạn bè
          </p>
        </div>

        {/* Slider */}
        <div className="relative max-w-5xl mx-auto h-[500px] rounded-3xl overflow-visible bg-white shadow-lg">
          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute z-10 -left-5 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-amber-100 transition"
          >
            <ArrowLeft className="text-amber-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute z-10 -right-5 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-amber-100 transition"
          >
            <ArrowRight className="text-amber-600" />
          </button>

          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              key={combo.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="w-full h-full md:flex px-6 py-4"
            >
              {/* Left: Info */}
              <div className="md:w-1/2 flex flex-col justify-between pr-6 py-5 px-5">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {combo.name}
                  </h3>
                  <div className="flex gap-4 my-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="text-amber-500" size={16} />
                      {combo.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {combo.serving_size} người
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {combo.description}
                  </p>
                  <ul className="text-sm space-y-1 mb-4 text-gray-700">
                    {combo.combo_items.map((item, idx) => (
                      <li key={idx}>
                        • {item.food.name}{" "}
                        <span className="text-amber-600">
                          (x{item.quantity})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-lg md:text-xl font-bold text-amber-700 mb-4">
                    {parseFloat(combo.price).toLocaleString()} VNĐ
                  </div>
                  <button className="w-full bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white py-2 rounded-lg font-semibold text-sm sm:text-base hover:opacity-90 transition">
                    Đặt Ngay
                  </button>
                </div>
              </div>

              {/* Right: Image */}
              <div className="md:w-1/2 flex items-center justify-center h-64">
                {combo.image ? (
                  <Image
                    src={combo.image}
                    alt={`Combo: ${combo.name}`}
                    className="max-h-full object-contain"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/placeholder.svg")
                    }
                  />
                ) : (
                  <ChefHat size={48} className="text-amber-400" />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {combos.map((_, i) => (
            <div
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                i === currentIndex ? "bg-amber-600 w-5" : "bg-amber-200"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
