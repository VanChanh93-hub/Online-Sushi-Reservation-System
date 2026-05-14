export interface Food {
  id: number;
  name: string;
  jpName: string;
  description?: string;
  price: number;
  category_id: number;
  status: boolean;
  season: string
  image?: string;
  group?:{
    id: number;
    name: string;
  }
  category?: {
    id: number;
    name: string;
  };
}

export interface FoodAdd {
  name: string;
  category_id: number;
  group_id?: number;
  jpName?: string;
  description?: string;
  price: number;
  image?: File;
}