"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationPopup from "../../../components/layout/NotificationPopup";
import DateTimeSelector from "../../../components/ReservationPage/DateTimeSelector";
import CustomerInfoForm from "../../../components/ReservationPage/CustomerInfoForm";
import PaymentNotesForm from "../../../components/ReservationPage/PaymentNotesForm";
import OrderSummary from "../../../components/ReservationPage/OrderSummary";
import FoodSelectionModal from "../../../components/ReservationPage/FoodSelectionModal";
import ComboSelectionModal from "../../../components/ReservationPage/ComboSelectionModal";
import { useBooking } from "../../../hooks/useBooking";
import { useAuth } from "../../../context/authContext";
import { useTranslation } from "../../../lib/i18n/client";

import {
  ComboItem,
  SelectedComboItem,
  Category,
  FoodItem,
  Combo,
} from "@/src/app/types/booking";

// Extended type for OrderSummary requirements
interface OrderSummaryComboItem extends ComboItem {
  combo_id: number;
  quantity: number;
}

export default function DatBanPage() {
  const { t, lang } = useTranslation("reservation");
  const router = useRouter();
  const { user, isLoading: authLoading, isInitialized } = useAuth();

  const {
    selectedDate,
    setSelectedDate,
    availableSlots,
    selectedTime,
    selectedTable,
    formData,
    setFormData,
    foods,
    combos,
    foodsData,
    combosData,
    showFoodModal,
    setShowFoodModal,
    showComboModal,
    setShowComboModal,
    activeFoodCategory,
    setActiveFoodCategory,
    notification,
    setNotification,
    today,
    voucherCode,
    setVoucherCode,
    discountAmount,
    fetchUserVouchers,
    fetchAvailableSlots,
    fetchFoods,
    fetchCombos,
    handleSelectTime,
    submitOrder,
    handleAddFood,
    handleRemoveFood,
    handleFoodQuantityChange,
    handleAddCombo,
    handleRemoveCombo,
    handleComboQuantityChange,
    getPaymentAmount,
    applyVoucherCode,
  } = useBooking();

  const currentUserId = user?.id || user?.user_id || null;

  useEffect(() => {
    if (currentUserId) {
      fetchUserVouchers(Number(currentUserId));
    }
  }, [currentUserId, fetchUserVouchers]);

  useEffect(() => {
    if (isInitialized && !user && !authLoading) {
      router.replace(
        `/${lang}/dang-nhap?returnUrl=${encodeURIComponent("/dat-ban")}`
      );
    }
  }, [user, authLoading, isInitialized, router]);

  // Loading state
  if (!isInitialized || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  // Normalize foods data
  const normalizedFoodsData: FoodItem[] = foodsData.map((food) => {
    let category: Category | undefined;

    if (food.category && typeof food.category === "object") {
      category = {
        id: Number(food.category.id),
        name: food.category.name,
        description: food.category.description || "",
        status: food.category.status || 1,
        created_at: food.category.created_at || new Date().toISOString(),
        updated_at: food.category.updated_at || new Date().toISOString(),
      };
    }

    return {
      id: food.id,
      name: food.name,
      description: food.description || "",
      price:
        typeof food.price === "string" ? parseFloat(food.price) : food.price,
      image: food.image || undefined,
      category,
      category_id: food.category_id || 0,
      group_id: food.group_id || 0,
      jpName: food.jpName || "",
      status: food.status || 1,
      created_at: food.created_at || new Date().toISOString(),
      updated_at: food.updated_at || new Date().toISOString(),
    };
  });

  const normalizedSelectedFoods = foods.map((food) => ({
    id: food.food_id,
    name: food.name,
    price: typeof food.price === "string" ? parseFloat(food.price) : food.price,
    quantity: food.quantity,
    image: food.image || undefined,
    description: food.description || "",
    food_id: food.food_id,
  }));

  // Normalize combos data for display
  const normalizedCombosData: ComboItem[] = combosData.map((combo) => ({
    id: combo.id,
    name: combo.name,
    description: combo.description || "",
    price: parseFloat(combo.price),
    image: combo.image || undefined,
    items: combo.combo_items.map((item) => ({
      food_id: item.food_id,
      name: item.food.name,
      price: parseFloat(item.food.price),
      quantity: item.quantity,
    })),
  }));

  // Convert to OrderSummary specific type
  const combosForOrderSummary: OrderSummaryComboItem[] = combos.map(
    (combo) => ({
      id: combo.id,
      combo_id: combo.combo_id,
      name: combo.name,
      description: combo.description || "",
      price:
        typeof combo.price === "string" ? parseFloat(combo.price) : combo.price,
      image: combo.image || undefined,
      quantity: combo.quantity,
      items: combo.items.map((item) => ({
        food_id: item.food_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    })
  );

  // For combo selection modal
  const normalizedCombos: SelectedComboItem[] = combos.map((combo) => ({
    combo_id: combo.combo_id,
    id: combo.id,
    name: combo.name,
    price:
      typeof combo.price === "string" ? parseFloat(combo.price) : combo.price,
    quantity: combo.quantity,
    items: combo.items.map((item) => ({
      food_id: item.food_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    image: combo.image || undefined,
    description: combo.description || "",
  }));

  const handleAddFoodWrapper = (food: FoodItem) => {
    const category_id = food.category?.id || food.category_id || 0;

    handleAddFood({
      ...food,
      price: food.price.toString(),
      description: food.description || null,
      image: food.image || null,
      category_id,
      group_id: food.group_id || 0,
      jpName: food.jpName || "",
      status: food.status || 1,
      created_at: food.created_at,
      updated_at: food.updated_at,
    });
  };

  const handleAddComboWrapper = (combo: ComboItem) => {
    handleAddCombo({
      id: combo.id,
      name: combo.name,
      image: combo.image || null,
      description: combo.description || "",
      price: combo.price.toString(),
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      combo_items: combo.items.map((item) => ({
        id: 0,
        combo_id: combo.id,
        food_id: item.food_id,
        quantity: item.quantity,
        food: {
          id: item.food_id,
          name: item.name,
          price: item.price.toString(),
        },
      })),
    });
  };

  return (
    <div className="container mx-auto py-[60px] sm:px-16 lg:px-24">
      <AnimatePresence>
        {notification.show && (
          <NotificationPopup
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Đặt Bàn Nhà Hàng
        </h1>
        <p className="text-gray-600">
          Chọn thời gian, bàn và món ăn bạn yêu thích
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <DateTimeSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            formData={formData}
            setFormData={setFormData}
            availableSlots={availableSlots}
            selectedTime={selectedTime}
            onTimeSelect={handleSelectTime}
            onFetchSlots={fetchAvailableSlots}
            today={today}
          />

          <CustomerInfoForm formData={formData} setFormData={setFormData} />

          <PaymentNotesForm formData={formData} setFormData={setFormData} />
        </div>

        <div className="space-y-6">
          <OrderSummary
            userId={currentUserId}
            selectedTable={selectedTable}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            foods={normalizedSelectedFoods}
            combos={combosForOrderSummary}
            formData={{
              ...formData,
              payment_method:
                formData.payment_method === "online" ? "online" : "cash",
            }}
            depositAmount={0}
            onAddFood={() => {
              setShowFoodModal(true);
              fetchFoods();
            }}
            onAddCombo={() => {
              setShowComboModal(true);
              fetchCombos();
            }}
            onSubmitOrder={submitOrder}
            isLoading={authLoading}
            getPaymentAmount={getPaymentAmount}
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            discountAmount={discountAmount}
            applyVoucherCode={applyVoucherCode}
          />
        </div>
      </div>

      <FoodSelectionModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        foods={normalizedFoodsData}
        selectedFoods={normalizedSelectedFoods}
        activeFoodCategory={activeFoodCategory}
        setActiveFoodCategory={setActiveFoodCategory}
        onAddFood={handleAddFoodWrapper}
        onRemoveFood={handleRemoveFood}
        onQuantityChange={handleFoodQuantityChange}
        totalPrice={normalizedSelectedFoods.reduce(
          (sum, food) => sum + food.price * food.quantity,
          0
        )}
        isLoading={authLoading}
        categories={
          Array.from(
            new Map(
              foodsData
                .filter((food) => food.category)
                .map((food) => [food.category?.id, food.category])
            ).values()
          ).filter(Boolean) as Category[]
        }
      />

      <ComboSelectionModal
        isOpen={showComboModal}
        onClose={() => setShowComboModal(false)}
        combos={normalizedCombosData}
        selectedCombos={normalizedCombos}
        onAddCombo={handleAddComboWrapper}
        onRemoveCombo={handleRemoveCombo}
        onQuantityChange={handleComboQuantityChange}
        totalPrice={normalizedCombos.reduce(
          (sum, combo) => sum + combo.price * combo.quantity,
          0
        )}
        isLoading={authLoading}
      />
    </div>
  );
}
