import type {
  Table,
  SelectedFoodItem,
  BookingFormData,
  SelectedComboItem,
} from "../booking";

export interface Voucher {
  id: string;
  code: string;
  name: string;
  discount_amount: number;
  discount_type: "fixed" | "percent";
  min_order_amount?: number;
  max_discount_amount?: number;
  expiry_date: string;
  description?: string;
}

export interface OrderSummaryProps {
  selectedTable: Table | null;
  selectedDate: string;
  selectedTime: string;
  foods: SelectedFoodItem[];
  combos?: SelectedComboItem[];
  formData: BookingFormData;
  depositAmount: number;
  onAddFood: () => void;
  onAddCombo: () => void;
  onSubmitOrder: () => void;
  isLoading: boolean;
  getPaymentAmount: () => number;
  voucherCode: string;
  setVoucherCode: (val: string) => void;
  discountAmount: number;
  applyVoucherCode: () => void;
  userVouchers: string[];
  userId: string;
}
