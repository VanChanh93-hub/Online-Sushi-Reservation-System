export interface Order {
  id: number;
  customer_id: number;
  total_price: number;
  status: string;
  payment_method: string;
  note?: string;
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  tables?: {
    id: number;
    table_number: string;
    max_guests: number;
  }[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  food_id?: number;
  combo_id?: number;
  quantity: number;
  price: number;
  status: string;
  food?: {
    id: number;
    name: string;
    image: string;
  };
  combo?: {
    id: number;
    name: string;
    image: string;
  };
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}
