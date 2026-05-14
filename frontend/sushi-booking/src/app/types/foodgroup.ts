export interface Group {
    id: number;
    name: string;
    category?: {
        id: number;
        name: string;
    };
}

export interface FoodGroupAdd {
  name: string;
  category_id: number;
}