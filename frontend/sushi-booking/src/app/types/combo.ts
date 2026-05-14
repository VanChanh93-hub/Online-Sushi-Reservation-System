export interface Combo {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  status: boolean;
};

export interface ComboItemAdd {
  food_id: number;
  quantity: number;
}

export interface ComboAdd {
  name: string;
  description?: string;
  price: number;
  image?: File;
  status: boolean;
  items: ComboItemAdd[];
}