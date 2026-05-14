// FoodSelectionModal.types.ts
import type {
  FoodItem,
  SelectedFoodItem,
  Category,
} from "@/src/app/types/booking";

export interface FoodSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  selectedFoods: SelectedFoodItem[];
  activeFoodCategory: string;
  setActiveFoodCategory: (category: string) => void;
  onAddFood: (food: FoodItem) => void;
  onRemoveFood: (foodId: number) => void;
  onQuantityChange: (foodId: number, quantity: number) => void;
  totalPrice: number;
  isLoading: boolean;
  categories: Category[];
}
