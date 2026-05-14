export interface Customer {
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