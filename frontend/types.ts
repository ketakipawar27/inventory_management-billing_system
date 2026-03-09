
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
  variant?: string;
  unit_price: number;
  stock_quantity: number;
  min_stock: number;
  is_active: boolean;
  description?: string;
}

export interface PurchaseItem {
  product_id: number;
  quantity: number;
  price_per_unit: number;
}

export interface Purchase {
  id: number;
  dealer_name: string;
  purchase_date: string;
  items: PurchaseItem[];
  total_amount: number;
}

export interface BillItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
}

export interface Bill {
  id: number;
  bill_date: string;
  customer_name: string;
  customer_phone?: string;
  customer_address?: string;
  items_detail: BillItem[]; // This matches the backend "items_detail" for GET requests
  total_amount: number;
  payment_method: "cash" | "online" | "pending";
}

export interface ApiError {
  message: string;
}
