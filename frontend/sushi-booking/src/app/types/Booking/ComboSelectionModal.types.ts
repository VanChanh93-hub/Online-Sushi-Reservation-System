export interface FoodItem {
  food_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  description?: string;
}

export interface ComboItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  items: FoodItem[];
  serving_size?: number;
  preparation_time?: number;
  rating?: number;
  review_count?: number;
}

export interface SelectedComboItem extends ComboItem {
  combo_id: number;
  quantity: number;
}

export interface ComboSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  combos: ComboItem[];
  selectedCombos: SelectedComboItem[];
  onAddCombo: (combo: ComboItem) => void;
  onRemoveCombo: (comboId: number) => void;
  onQuantityChange: (comboId: number, quantity: number) => void;
  totalPrice: number;
  isLoading: boolean;
}
