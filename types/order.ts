export interface Order {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "paid" | "failed";
  payment_url?: string;
  created_at: string;
}
