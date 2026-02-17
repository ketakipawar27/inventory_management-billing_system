
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  category: number | Category;
  sku: string;
  price: number;
  stock_quantity: number;
  description?: string;
}

export interface PurchaseItem {
  product: number;
  quantity: number;
  unit_price: number;
}

export interface Purchase {
  id: number;
  purchase_date: string;
  items: PurchaseItem[];
  total_amount: number;
}

export interface BillItem {
  product: number; // The ID
  product_name?: string; // Optional (if backend sends it)
  quantity: number;
  unit_price: number;
  total_price: number; // UI uses this
}

export interface Bill {
  id: number;
  bill_date: string;
  customer_name: string; // Removed optional '?' to match typical usage
  customer_phone?: string;
  customer_address?: string;
  items: BillItem[]; // ✅ Correct name is 'items'
  total_amount: number;
  payment_method: "cash" | "online" | "pending"; // Added this missing field
}

export interface ApiError {
  message: string;
}
