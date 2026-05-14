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
  FiPackage,
} from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import type {
  ComboItem,
  ComboSelectionModalProps,
} from "../../types/Booking/ComboSelectionModal.types";

export default function ComboSelectionModal({
  isOpen,
  onClose,
  combos = [],
  selectedCombos,
  onAddCombo,
  onRemoveCombo,
  onQuantityChange,
  totalPrice,
  isLoading,
}: ComboSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCombo, setSelectedCombo] = useState<ComboItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen || isDetailModalOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isDetailModalOpen]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);

  const filteredCombos = useMemo(() => {
    return combos.filter((combo) =>
      combo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, combos]);

  const calculateOriginalPrice = (combo: ComboItem) => {
    return combo.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateDiscount = (combo: ComboItem) => {
    return calculateOriginalPrice(combo) - combo.price;
  };

  const openDetailModal = (combo: ComboItem) => {
    setSelectedCombo(combo);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCombo(null);
  };

  const renderImage = (src?: string, alt?: string, className = "") => {
    return src ? (
      <div className={`relative ${className}`}>
        <Image
          src={src}
          alt={alt || "Combo image"}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    ) : (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <FiImage className="text-gray-400" size={24} />
      </div>
    );
  };

  const renderComboCard = (combo: ComboItem) => (
    <motion.div
      key={`combo-${combo.id}`}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer border border-gray-100"
      onClick={() => openDetailModal(combo)}
    >
      <div className="relative h-48">
        {renderImage(combo.image ?? undefined, combo.name, "w-full h-full")}
        <div className="absolute top-3 left-3 bg-[#4CAF50] text-white text-xs px-3 py-1 rounded-full flex items-center">
          <FiPackage size={12} className="mr-1" />
          <span>COMBO</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
          {combo.name}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-[#4CAF50]">
            {formatCurrency(combo.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddCombo(combo);
            }}
            className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#3d8b40] text-white px-4 py-2 rounded-md text-sm font-semibold shadow transition duration-200"
          >
            <FiPlus size={18} />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderComboDetailModal = () => (
    <AnimatePresence>
      {isDetailModalOpen && selectedCombo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeDetailModal}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header combo */}
            <div className="relative h-72 w-full">
              {selectedCombo.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedCombo.image}
                    alt={selectedCombo.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-amber-50 to-orange-100 flex items-center justify-center">
                  <FiPackage className="text-gray-400" size={80} />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedCombo.name}
                </h2>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center">
                    <FiUsers className="mr-2" />
                    <span>2-4 người</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    <span>30 phút</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeDetailModal}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Nội dung combo */}
            <div className="flex-1 overflow-y-auto p-8">
              {selectedCombo.description && (
                <div className="mb-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <p className="text-gray-700 italic">
                    {selectedCombo.description}
                  </p>
                </div>
              )}
              <div className="space-y-6">
                {selectedCombo.items.map((item) => (
                  <div
                    key={`combo-item-${item.food_id}`}
                    className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="relative w-full sm:w-1/3 h-48 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <FiImage className="text-gray-400" size={40} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-gray-600 mb-4">{item.description}</p>
                      )}
                      <div className="mt-auto grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Đơn giá</p>
                          <p className="font-medium">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Số lượng</p>
                          <p className="font-medium">{item.quantity}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Thành tiền</p>
                          <p className="text-lg font-bold text-amber-600">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-1">
                      Tổng giá trị combo
                    </h4>
                    <p className="text-gray-600">
                      {selectedCombo.items.length} món • Tiết kiệm{" "}
                      {formatCurrency(calculateDiscount(selectedCombo))}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-gray-500 line-through">
                        {formatCurrency(calculateOriginalPrice(selectedCombo))}
                      </p>
                      <p className="text-3xl font-bold text-[#4CAF50]">
                        {formatCurrency(selectedCombo.price)}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onAddCombo(selectedCombo);
                        closeDetailModal();
                      }}
                      className="bg-[#4CAF50] hover:bg-[#3d8b40] text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-lg"
                    >
                      <FiShoppingCart size={20} />
                      <span className="font-medium">Thêm vào giỏ hàng</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-4">
                  <div className="bg-[#4CAF50]/10 p-3 rounded-full">
                    <FiPackage className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Chọn combo từ thực đơn
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
                {/* Combo List */}
                <div className="lg:col-span-2 flex flex-col overflow-hidden border-r">
                  <div className="p-6 border-b">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Tìm kiếm combo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
                      />
                      <FiSearch
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto p-6 flex-1 bg-gray-50">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
                      </div>
                    ) : filteredCombos.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                        <FiPackage size={64} className="mb-6 opacity-30" />
                        <p className="text-xl font-medium">
                          Không tìm thấy combo nào
                        </p>
                        <p className="text-base mb-4">
                          Hãy thử từ khóa khác hoặc kiểm tra chính tả
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCombos.map(renderComboCard)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Combos */}
                <div className="flex flex-col bg-white overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                      <span>
                        Combo đã chọn{" "}
                        <span className="text-[#4CAF50]">
                          ({selectedCombos.length})
                        </span>
                      </span>
                      {selectedCombos.length > 0 && (
                        <button
                          onClick={() =>
                            selectedCombos.forEach((combo) =>
                              onRemoveCombo(combo.combo_id)
                            )
                          }
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    {selectedCombos.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-gray-500 py-12">
                        <FiShoppingCart size={64} className="mb-6 opacity-30" />
                        <p className="text-lg font-medium">Chưa chọn combo</p>
                        <p className="text-base mt-2 text-center">
                          Hãy chọn combo từ danh sách bên trái
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedCombos.map((combo) => (
                          <motion.div
                            key={`selected-combo-${combo.combo_id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-100"
                          >
                            <div className="flex items-center">
                              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                                {renderImage(
                                  combo.image ?? undefined,
                                  combo.name,
                                  "w-full h-full"
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {combo.name}
                                </p>
                                <p className="text-sm text-[#4CAF50] font-medium">
                                  {formatCurrency(combo.price)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  const newQuantity = combo.quantity - 1;
                                  if (newQuantity <= 0) {
                                    onRemoveCombo(combo.combo_id);
                                  } else {
                                    onQuantityChange(
                                      combo.combo_id,
                                      newQuantity
                                    );
                                  }
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
                              >
                                <FiMinus size={16} />
                              </button>
                              <span className="font-medium w-8 text-center">
                                {combo.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  onQuantityChange(
                                    combo.combo_id,
                                    combo.quantity + 1
                                  )
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
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg text-gray-600">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-[#4CAF50]">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="w-full py-3 bg-[#4CAF50] hover:bg-[#3d8b40] text-white rounded-xl transition-colors flex items-center justify-center gap-3 font-medium shadow-md"
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

      {renderComboDetailModal()}
    </>
  );
}
