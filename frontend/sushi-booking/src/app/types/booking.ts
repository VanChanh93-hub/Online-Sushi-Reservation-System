/** ========== BÀN ========== */
export interface Table {
  table_id: number;
  table_number: string;
  max_guests: number;
  status: string;
  location?: string;
}

export interface TimeSlot {
  time: string;
  tables: Table[];
}

/** ========== DANH MỤC MÓN ĂN ========== */
export interface Category {
  id: number;
  name: string;
  description: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryAdd {
  name: string;
  description?: string;
}

/** ========== MÓN ĂN ========== */
export interface FoodItem {
  id: number;
  category_id: number;
  group_id: number | null;
  name: string;
  jpName: string;
  image?: string | null;
  description?: string | null;
  category?: Category;
  price: string | number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface SelectedFoodItem {
  id: number;
  food_id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string | null;
  image?: string | null;
  category?: string | Category | null;
}

/** ========== COMBO ========== */
export interface Combo {
  id: number;
  name: string;
  image: string | null;
  description: string;
  price: string;
  status: number;
  created_at: string;
  updated_at: string;
  combo_items: {
    id: number;
    combo_id: number;
    food_id: number;
    quantity: number;
    food: {
      id: number;
      name: string;
      price: string;
    };
  }[];
}

export interface FullComboData extends Combo {}

export interface ComboItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  items: {
    food_id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export interface SelectedComboItem {
  id: number;
  combo_id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string | null;
  description?: string;
  items: {
    food_id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

/** ========== ĐẶT BÀN ========== */
export interface BookingFormData {
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  guest_count: number;
  reservation_date: string;
  reservation_time: string;
  payment_method: string;
  total_price: number;
  note: string;
}

export interface BookingRequest {
  reservation: Omit<BookingFormData, "customer_name" | "customer_phone">;
  foods: {
    food_id: number;
    quantity: number;
    price: number;
  }[];
  combos: {
    combo_id: number;
    quantity: number;
    price: number;
  }[];
  voucher_id?: number | null;
}

/** ========== USER ========== */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  point?: number;
  membership_level?: string;
  role: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

/** ========== VOUCHER ========== */
export interface Voucher {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  start_date: string;
  end_date: string;
  status: number;
}

/** ========== TOAST THÔNG BÁO ========== */
export type NotificationState = {
  message: string;
  type: "success" | "error" | "info" | "warning";
  show: boolean;
};
