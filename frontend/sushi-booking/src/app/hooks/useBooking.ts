"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import type {
  Table,
  TimeSlot,
  FoodItem,
  SelectedFoodItem,
  BookingFormData,
  NotificationState,
  Combo,
  SelectedComboItem,
  Category,
} from "../types/booking";

export function useBooking() {
  const router = useRouter();
  const { user, isLoading: authLoading, isInitialized } = useAuth();

  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    customer_id: 0,
    guest_count: 1,
    reservation_date: "",
    reservation_time: "",
    payment_method: "cash",
    total_price: 0,
    note: "",
    customer_name: "",
    customer_phone: "",
  });

  const [foods, setFoods] = useState<SelectedFoodItem[]>([]);
  const [combos, setCombos] = useState<SelectedComboItem[]>([]);
  const [foodsData, setFoodsData] = useState<FoodItem[]>([]);
  const [combosData, setCombosData] = useState<Combo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voucherId, setVoucherId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showComboModal, setShowComboModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentQRCode, setPaymentQRCode] = useState<string>("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [activeFoodCategory, setActiveFoodCategory] = useState("all");
  const [activeComboCategory, setActiveComboCategory] = useState("all");
  const [userVouchers, setUserVouchers] = useState<string[]>([]);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    show: false,
  });

  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");
      const res = await axios.get("http://127.0.0.1:8000/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserVouchers = async (userId: number) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/getAllVoucherByUser/${userId}`
      );
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      if (Array.isArray(data)) {
        setUserVouchers(data);
      } else {
        console.error("Voucher response is not an array:", res.data);
        setUserVouchers([]);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setUserVouchers([]);
    }
  };

  let notificationQueue: {
    message: string;
    type: "success" | "error" | "info";
  }[] = [];
  let isShowingNotification = false;

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    notificationQueue.push({ message, type });

    const displayNextNotification = () => {
      if (isShowingNotification || notificationQueue.length === 0) return;

      const next = notificationQueue.shift();
      if (!next) return;

      setNotification({ message: next.message, type: next.type, show: true });
      isShowingNotification = true;

      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
        setTimeout(() => {
          isShowingNotification = false;
          displayNextNotification();
        }, 500); // delay trước khi hiện cái tiếp theo
      }, 3000); // thời gian hiển thị 1 thông báo
    };

    displayNextNotification();
  };

  const calculateDepositAmount = () => {
    return formData.guest_count > 12 ? 200000 : 0;
  };

  const depositAmount = calculateDepositAmount();

  const handlePaymentComplete = async () => {
    setPaymentCompleted(true);
    setShowPaymentModal(false);
    showNotification("Thanh toán thành công!", "success");
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate) {
      showNotification("Vui lòng chọn bàn", "error");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tables/DateTime",
        { reservation_date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableSlots(response.data.available_slots || []);
    } catch {
      showNotification("Lỗi khi kiểm tra bàn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");
      const res = await axios.get("http://127.0.0.1:8000/api/foods", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map category data to each food item
      const foodsWithCategories = res.data.data.map((food: FoodItem) => {
        const category = categories.find(
          (cat) => cat.id === food.category_id // Now both are numbers
        );
        return {
          ...food,
          category: category || null,
          price:
            typeof food.price === "string"
              ? parseFloat(food.price)
              : food.price || 0, // Convert string price to number
        };
      });

      setFoodsData(foodsWithCategories || []);
    } catch {
      showNotification("Lỗi khi tải danh sách món ăn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCombos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");
      const res = await axios.get("http://127.0.0.1:8000/api/combos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCombosData(res.data || []);
    } catch {
      showNotification("Lỗi khi tải danh sách combo", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const applyVoucherCode = async () => {
    if (!voucherCode) {
      showNotification("Vui lòng nhập mã giảm giá", "error");
      return;
    }

    if (!user) {
      showNotification("Vui lòng đăng nhập để sử dụng mã giảm giá", "error");
      return;
    }

    try {
      const token = localStorage.getItem("auth");
      const res = await axios.post(
        "http://127.0.0.1:8000/api/applyVoucher",
        {
          code: voucherCode,
          customer: user.id,
          total: formData.total_price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { discount, message, new_total, voucher } = res.data;

      if (discount > 0) {
        setDiscountAmount(discount);
        setVoucherId(voucher?.id || null);
        showNotification(
          message || "Áp dụng mã giảm giá thành công!",
          "success"
        );

        setFormData((prev) => ({
          ...prev,
          total_price: new_total,
        }));
      } else {
        setDiscountAmount(0);
        setVoucherId(null);
        showNotification("Mã giảm giá không hợp lệ hoặc đã hết hạn", "error");
      }
    } catch (err: any) {
      console.error("Voucher error:", err);
      setDiscountAmount(0);
      showNotification(
        err?.response?.data?.message || "Lỗi khi áp dụng mã giảm giá",
        "error"
      );
    }
  };

  const submitOrder = async () => {
    if (!selectedTable) {
      showNotification("Vui lòng chọn bàn", "error");
      return;
    }

    if (!formData.customer_name || !formData.customer_phone) {
      showNotification("Please enter contact information", "error");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth");

      const finalTotal = Math.max(formData.total_price - discountAmount, 0);
      const deposit = calculateDepositAmount();
      const remainingPayment =
        formData.payment_method === "cash"
          ? Math.max(finalTotal - deposit, 0)
          : 0;

      const payAmount =
        formData.payment_method === "cash" ? deposit : finalTotal + deposit;

      const res = await axios.post(
        "http://127.0.0.1:8000/api/orders/bookTables",
        {
          ...formData,
          total_price: finalTotal,
          deposit_amount: deposit,
          remaining_payment: remainingPayment,
          table_id: selectedTable.table_id,
          voucher_id: voucherId,
          foods: foods.map((f) => ({
            food_id: f.food_id,
            quantity: f.quantity,
            price: f.price,
          })),
          combos: combos.map((c) => ({
            combo_id: c.combo_id,
            quantity: c.quantity,
            price: c.price,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const order_id = res.data.order_id;
      setOrderId(order_id);

      const shouldRedirectToVNPAY =
        formData.payment_method === "vnpay" || formData.guest_count >= 12;

      if (shouldRedirectToVNPAY) {
        const payRes = await axios.post(
          "http://127.0.0.1:8000/api/orders/vnpay-url",
          { order_id, amount: payAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const payUrl = payRes.data?.data;
        if (payUrl) {
          window.location.href = payUrl;
        } else {
          showNotification("Could not get payment link", "error");
        }
      } else {
        showNotification(
          "Đặt bàn thành công! Vui lòng thanh toán tại nhà hàng.",
          "success"
        );
        router.push("/");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      showNotification(
        err?.response?.data?.message || "Error making booking",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);

    const slot = availableSlots.find((s) => s.time === time);
    if (!slot || slot.tables.length === 0) {
      showNotification("No available tables for this time slot", "error");
      return;
    }

    const guestCount = formData.guest_count;
    const sortedTables = [...slot.tables].sort(
      (a, b) => b.max_guests - a.max_guests
    );

    if (guestCount <= 12) {
      const oneTable = sortedTables
        .filter((t) => t.max_guests >= guestCount)
        .sort((a, b) => a.max_guests - b.max_guests)[0];

      if (oneTable) {
        setSelectedTable(oneTable);
        setFormData((prev) => ({
          ...prev,
          reservation_date: selectedDate,
          reservation_time: time.length === 5 ? `${time}:00` : time,
        }));
      } else {
        showNotification("Không có bàn phù hợp với số lượng khách", "error");
      }
      return;
    }

    let bestPair: Table[] = [];
    let minWastedSeats = Infinity;

    for (let i = 0; i < sortedTables.length; i++) {
      for (let j = i + 1; j < sortedTables.length; j++) {
        const totalGuests =
          sortedTables[i].max_guests + sortedTables[j].max_guests;
        if (totalGuests >= guestCount) {
          const wasted = totalGuests - guestCount;
          if (wasted < minWastedSeats) {
            minWastedSeats = wasted;
            bestPair = [sortedTables[i], sortedTables[j]];
          }
        }
      }
    }

    if (bestPair.length === 2) {
      setSelectedTable(bestPair[0]);
      showNotification(
        `Guests divided into 2 tables (total seats: ${
          bestPair[0].max_guests + bestPair[1].max_guests
        })`,
        "info"
      );
      setFormData((prev) => ({
        ...prev,
        reservation_date: selectedDate,
        reservation_time: time.length === 5 ? `${time}:00` : time,
      }));
    } else {
      showNotification("Không thể chia khách thành 2 bàn", "error");
    }
  };

  const handleAddFood = (food: FoodItem) => {
    setFoods((prev: SelectedFoodItem[]) => {
      const existing = prev.find((f) => f.food_id === food.id);

      // Chuẩn hóa category trước khi thêm vào state
      let normalizedCategory: string | Category | null | undefined;

      if (typeof food.category === "object" && food.category !== null) {
        normalizedCategory = food.category.name; // Chỉ lấy tên nếu là object
      } else {
        normalizedCategory = food.category; // Giữ nguyên nếu là string hoặc null/undefined
      }

      if (existing) {
        return prev.map((f) =>
          f.food_id === food.id ? { ...f, quantity: f.quantity + 1 } : f
        );
      }

      return [
        ...prev,
        {
          id: food.id,
          food_id: food.id,
          name: food.name,
          price:
            typeof food.price === "string"
              ? parseFloat(food.price)
              : food.price || 0,
          quantity: 1,
          image: food.image ?? null,
          category: normalizedCategory, // Sử dụng category đã chuẩn hóa
        },
      ];
    });
  };

  const handleRemoveFood = (id: number) =>
    setFoods((prev) => prev.filter((f) => f.food_id !== id));

  const handleFoodQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return handleRemoveFood(id);
    setFoods((prev) =>
      prev.map((f) => (f.food_id === id ? { ...f, quantity } : f))
    );
  };

  const handleAddCombo = (combo: Combo) => {
    setCombos((prev) => {
      const existing = prev.find((c) => c.combo_id === combo.id);
      if (existing) {
        return prev.map((c) =>
          c.combo_id === combo.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: combo.id,
          combo_id: combo.id,
          name: combo.name,
          quantity: 1,
          price:
            typeof combo.price === "string"
              ? parseFloat(combo.price)
              : combo.price || 0, // Convert combo price to number
          image: combo.image,
          description: combo.description,
          items: combo.combo_items.map((item) => ({
            food_id: item.food.id,
            name: item.food.name,
            price:
              typeof item.food.price === "string"
                ? parseFloat(item.food.price)
                : item.food.price || 0, // Convert item price to number
            quantity: item.quantity,
          })),
        },
      ];
    });
  };
  const handleRemoveCombo = (id: number) =>
    setCombos((prev) => prev.filter((c) => c.combo_id !== id));

  const handleComboQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return handleRemoveCombo(id);
    setCombos((prev) =>
      prev.map((c) => (c.combo_id === id ? { ...c, quantity } : c))
    );
  };

  const getPaymentAmount = () => {
    const finalTotal = Math.max(formData.total_price - discountAmount, 0);
    const deposit = calculateDepositAmount();

    return formData.payment_method === "vnpay" ? finalTotal : deposit;
  };

  const remainingCashPayment =
    formData.payment_method === "cash"
      ? Math.max(formData.total_price - discountAmount - depositAmount, 0)
      : 0;

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_id: +user.id,
        customer_name: user.name || "",
        customer_phone: user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user && isInitialized) {
      router.push("/dang-nhap");
    }
  }, [authLoading, user, isInitialized]);

  useEffect(() => {
    const foodTotal = foods.reduce(
      (sum, food) => sum + food.price * food.quantity,
      0
    );
    const comboTotal = combos.reduce(
      (sum, combo) => sum + combo.price * combo.quantity,
      0
    );
    setFormData((prev) => ({ ...prev, total_price: foodTotal + comboTotal }));
  }, [foods, combos]);

  useEffect(() => {
    if (user) {
      fetchCategories().then(() => {
        fetchFoods();
        fetchCombos();
      });
      fetchUserVouchers(+user.id);
    }
  }, [user]);

  return {
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
    categories,
    voucherId,
    setVoucherId,
    orderId,
    showFoodModal,
    setShowFoodModal,
    showComboModal,
    setShowComboModal,
    activeFoodCategory,
    setActiveFoodCategory,
    activeComboCategory,
    setActiveComboCategory,
    depositAmount,
    showPaymentModal,
    setShowPaymentModal,
    paymentQRCode,
    paymentCompleted,
    notification,
    setNotification,
    today,
    user,
    isLoading,
    isInitialized,
    voucherCode,
    setVoucherCode,
    discountAmount,
    applyVoucherCode,
    userVouchers,
    fetchUserVouchers,
    fetchAvailableSlots,
    fetchFoods,
    fetchCombos,
    handleSelectTime,
    getPaymentAmount,
    remainingCashPayment,
    submitOrder,
    handlePaymentComplete,
    handleAddFood,
    handleRemoveFood,
    handleFoodQuantityChange,
    handleAddCombo,
    handleRemoveCombo,
    handleComboQuantityChange,
  };
}
