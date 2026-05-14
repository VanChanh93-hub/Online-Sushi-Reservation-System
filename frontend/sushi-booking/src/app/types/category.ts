export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryAdd {
  name: string;
  description?: string;
}
