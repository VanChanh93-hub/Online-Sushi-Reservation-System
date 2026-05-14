export interface Table {
  id: number;
  table_number: string;
  max_guests: number;
  status: "available" | "reserved" | "occupied";
}

export interface TableAdd {
  table_number: string;
  max_guests: number;
  status: "available" | "reserved" | "occupied";
}
