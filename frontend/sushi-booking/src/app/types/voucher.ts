export interface Voucher {
  id: number;
  code: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  status: string;
  usage_limit: number;
}

export interface VoucherAdd {
  code: string;
  usage_limit: number;
  discount_value: number;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  status: "active" | "inactive";
}
