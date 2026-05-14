"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiImage,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiSearch,
  FiClock,
  FiUsers,
  FiStar,
} from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import { FoodItem } from "../../types/booking";
import type { FoodSelectionModalProps } from "../../types/Booking/FoodSelectionModal.types";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);

const generateKey = (prefix: string, ...args: (string | number)[]) =>
  `${prefix}-${args.join("-")}`;

export default function FoodSelectionModal({
  isOpen,
  onClose,
  foods = [],
  selectedFoods,
  activeFoodCategory,
  setActiveFoodCategory,
  onAddFood,
  onRemoveFood,
  onQuantityChange,
  totalPrice,
  isLoading,
  categories = [],
}: FoodSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen || isDetailModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, isDetailModalOpen]);

  const foodCategories = useMemo(() => {
    const categoriesWithAll = [
      {
        id: "all",
        name: "Tất cả",
        count: foods.length,
      },
    ];

    categories.forEach((category) => {
      const count = foods.filter(
        (food) =>
          food.category_id === category.id || food.category?.id === category.id
      ).length;

      if (count > 0) {
        categoriesWithAll.push({
          id: category.id.toString(),
          name: category.name,
          count,
        });
      }
    });

    const uncategorizedCount = foods.filter(
      (food) => !food.category_id && !food.category?.id
    ).length;

    if (uncategorizedCount > 0) {
      categoriesWithAll.push({
        id: "other",
        name: "Khác",
        count: uncategorizedCount,
      });
    }

    return categoriesWithAll;
  }, [foods, categories]);

  const filteredItems = useMemo(() => {
    let filtered = foods;

    if (activeFoodCategory !== "all" && activeFoodCategory !== "other") {
      filtered = filtered.filter(
        (food) =>
          food.category_id?.toString() === activeFoodCategory ||
          food.category?.id.toString() === activeFoodCategory
      );
    } else if (activeFoodCategory === "other") {
      filtered = filtered.filter(
        (food) => !food.category_id && !food.category?.id
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activeFoodCategory, searchTerm, foods]);

  const openDetailModal = (item: FoodItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  };

  const renderItemImage = (item: FoodItem) => {
    if (item.image) {
      return (
        <Image
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          width={300}
          height={200}
          onError={(e) => {
            const imgElement = e.currentTarget as HTMLImageElement;
            imgElement.src = "/placeholder.svg";
          }}
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-300">
        <FiImage size={48} />
      </div>
    );
  };

  const renderItemCard = (item: FoodItem) => (
    <motion.div
      key={generateKey("food", item.id)}
      variants={itemVariants}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.15)",
      }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={() => openDetailModal(item)}
    >
      <div className="h-48 bg-gray-100 relative">{renderItemImage(item)}</div>
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-500 line-clamp-3">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#AF763E]">
            {formatCurrency(Number(item.price))}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFood(item);
            }}
            className="bg-[#AF763E] hover:bg-[#8E5F32] text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
          >
            <FiPlus size={16} className="mr-2" />
            Thêm
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
      <FiImage size={64} className="mb-6 opacity-30" />
      <p className="text-xl font-medium">Không tìm thấy món ăn nào</p>
      <p className="text-base">Vui lòng thử tìm kiếm hoặc chọn danh mục khác</p>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[85vw] max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-8 border-b">
                <div className="flex items-center gap-4">
                  <div className="bg-[#AF763E]/10 p-3 rounded-full">
                    <FiShoppingCart className="w-8 h-8 text-[#AF763E]" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Chọn món từ thực đơn
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-8 h-8" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-0">
                <div className="lg:col-span-2 flex flex-col overflow-hidden border-r">
                  <div className="p-6 border-b">
                    <div className="relative mb-6">
                      <input
                        type="text"
                        placeholder="Tìm kiếm món ăn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF763E]/30 focus:border-[#AF763E] text-lg"
                      />
                      <FiSearch
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>

                    <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
                      {foodCategories.map((category) => (
                        <button
                          key={generateKey("category", category.id)}
                          onClick={() => setActiveFoodCategory(category.id)}
                          className={`px-6 py-3 rounded-full text-base font-medium whitespace-nowrap transition-all flex items-center ${
                            activeFoodCategory === category.id
                              ? "bg-[#AF763E] text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category.name}
                          <span className="ml-2 text-xs opacity-80">
                            ({category.count})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-y-auto p-6 flex-1 bg-gray-50">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#AF763E]"></div>
                      </div>
                    ) : filteredItems.length === 0 ? (
                      renderEmptyState()
                    ) : (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      >
                        {filteredItems.map(renderItemCard)}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col h-full bg-white overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <span className="bg-[#AF763E] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                          {selectedFoods.length}
                        </span>
                        Món đã chọn
                      </h3>
                      {selectedFoods.length > 0 && (
                        <button
                          onClick={() => {
                            selectedFoods.forEach((food) =>
                              onRemoveFood(food.id)
                            );
                          }}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    {selectedFoods.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                        <FiShoppingCart size={64} className="mb-6 opacity-30" />
                        <p className="text-lg font-medium">Giỏ hàng trống</p>
                        <p className="text-base text-center mt-2">
                          Hãy thêm món ăn từ thực đơn
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                        {selectedFoods.map((food) => (
                          <motion.div
                            key={generateKey("selected", food.id, food.price)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              {food.image ? (
                                <Image
                                  src={food.image}
                                  alt={food.name}
                                  className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
                                  width={64}
                                  height={64}
                                  onError={(e) => {
                                    const imgElement =
                                      e.currentTarget as HTMLImageElement;
                                    imgElement.src = "/placeholder.svg";
                                  }}
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4 flex-shrink-0">
                                  <FiImage
                                    className="text-gray-400"
                                    size={24}
                                  />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-base font-medium text-gray-800 truncate">
                                  {food.name}
                                </p>
                                <p className="text-sm text-[#AF763E] font-medium">
                                  {formatCurrency(food.price)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <button
                                onClick={() => {
                                  food.quantity <= 1
                                    ? onRemoveFood(food.id)
                                    : onQuantityChange(
                                        food.id,
                                        food.quantity - 1
                                      );
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
                              >
                                <FiMinus size={16} />
                              </button>
                              <span className="text-base font-medium w-8 text-center">
                                {food.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  onQuantityChange(food.id, food.quantity + 1)
                                }
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                              >
                                <FiPlus size={16} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg text-gray-600">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-[#AF763E]">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="w-full py-4 bg-[#AF763E] hover:bg-[#8E5F32] text-white rounded-xl transition-colors flex items-center justify-center gap-3 font-medium shadow-md text-lg"
                    >
                      <FiShoppingCart size={20} />
                      Xác nhận đơn hàng
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDetailModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeDetailModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                  width={800}
                  height={400}
                  onError={(e) => {
                    const imgElement = e.currentTarget as HTMLImageElement;
                    imgElement.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <button
                  onClick={closeDetailModal}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <FiX size={24} />
                </button>

                {selectedItem.category && (
                  <div className="absolute top-4 left-4 bg-[#AF763E] text-white px-4 py-2 rounded-full text-sm font-medium">
                    {selectedItem.category.name}
                  </div>
                )}

                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedItem.name}
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-yellow-400">
                      {formatCurrency(Number(selectedItem.price))}
                    </span>
                    <div className="flex items-center gap-1">
                      <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.5</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Mô tả món ăn
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {selectedItem.description ||
                        "Món ăn được chế biến từ những nguyên liệu tươi ngon nhất, mang đến hương vị đặc trưng và trải nghiệm ẩm thực tuyệt vời."}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FiClock className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">
                          Thời gian chuẩn bị: 15-20 phút
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiUsers className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">
                          Khẩu phần: 1-2 người
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">
                        Thông tin đặt món
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Giá:</span>
                          <span className="text-xl font-bold text-[#AF763E]">
                            {formatCurrency(Number(selectedItem.price))}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Đánh giá:</span>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">4.5/5</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Trạng thái:</span>
                          <span className="text-green-600 font-medium">
                            Còn hàng
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={() => {
                            onAddFood(selectedItem);
                            closeDetailModal();
                          }}
                          className="w-full bg-[#AF763E] hover:bg-[#8E5F32] text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-3 text-lg font-medium"
                        >
                          <FiPlus size={20} />
                          Thêm vào giỏ hàng
                        </button>

                        <button
                          onClick={closeDetailModal}
                          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition-colors text-base font-medium"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
