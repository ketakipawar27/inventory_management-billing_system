import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import { Product, Category } from "../types";
import { ProductGrid } from "../components/billing/ProductGrid";
import { BillCart, CartItem } from "../components/billing/BillCart";
import { BillForm } from "../components/billing/BillForm";
import { BillHistory } from "../components/billing/BillHistory";
import { ShoppingCart, History, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";

const Billing: React.FC = () => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<"create" | "history">("create");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | "pending">("cash");

  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.products.list(),
        api.categories.list()
      ]);
      setProducts(productsData.filter(p => p.is_active));
      setCategories(categoriesData);
    } catch (err) {
      showToast("Failed to fetch data", "error");
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToCart = (product: Product) => {
    if (cart.find((c) => c.product.id === product.id)) return;
    setCart([...cart, { product, quantity: 1, price: product.unit_price }]);
    showToast(`${product.name} added to cart`, "info");
  };

  const updateQuantity = (id: number, value: string) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.product.id !== id) return i;
        if (value === "") return { ...i, quantity: "" };
        const qty = Number(value);
        const safeQty = Math.min(qty, i.product.stock_quantity);
        if (qty > i.product.stock_quantity) {
          showToast(`Only ${i.product.stock_quantity} units available in stock`, "info");
        }
        return { ...i, quantity: safeQty };
      })
    );
  };

  const handleBlurQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.product.id !== id) return i;
        if (i.quantity === "" || i.quantity === 0) return { ...i, quantity: 1 };
        return i;
      })
    );
  };

  const updatePrice = (id: number, price: number) => {
    setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, price } : i)));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((i) => i.product.id !== id));
  };

  const total = cart.reduce((sum, i) => sum + (Number(i.quantity) || 0) * i.price, 0);

  const handleSubmit = async () => {
    if (loading || !customerName || cart.length === 0) return;
    setLoading(true);
    try {
      await api.bills.create({
        customer_name: customerName,
        customer_phone: customerPhone || null,
        customer_address: customerAddress || null,
        payment_method: paymentMethod,
        bill_date: new Date().toISOString().split("T")[0],
        items: cart.map((i) => ({
          product_id: i.product.id,
          quantity: Number(i.quantity) || 1,
          price_per_unit: i.price,
        })),
      });
      await fetchData();
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setPaymentMethod("cash");
      showToast("Bill generated successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Billing failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* HEADER / MODE TOGGLE */}
      <div className="flex justify-center shrink-0">
          <div className="bg-white dark:bg-neutral-900 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex gap-1 shadow-sm w-full max-w-md sm:w-auto">
              <Button
                variant={mode === "create" ? "primary" : "ghost"}
                size="md"
                onClick={() => setMode("create")}
                className={cn(
                   "flex-1 sm:flex-none px-6 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest",
                   mode === "create" ? "shadow-md" : "text-neutral-500"
                )}
                icon={<Plus size={14} />}
              >
                 New Bill
              </Button>
              <Button
                variant={mode === "history" ? "primary" : "ghost"}
                size="md"
                onClick={() => setMode("history")}
                className={cn(
                   "flex-1 sm:flex-none px-6 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest",
                   mode === "history" ? "shadow-md" : "text-neutral-500"
                )}
                icon={<History size={14} />}
              >
                 History
              </Button>
          </div>
      </div>

      {/* CONDITIONAL RENDERING */}
      {mode === "history" ? (
         <div className="overflow-y-auto min-h-0">
            <BillHistory />
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: PRODUCTS */}
            <div className="lg:col-span-5 lg:h-[calc(100vh-14rem)]">
              <ProductGrid products={products} categories={categories} onAddToCart={addToCart} />
            </div>

            {/* RIGHT: BILLING */}
            <div className="lg:col-span-7">
              <Card className="w-full flex flex-col shadow-lg overflow-hidden p-0 border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl">
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50 shrink-0">
                  <h2 className="font-bold text-sm flex gap-2 items-center tracking-tight text-neutral-800 dark:text-white">
                    <ShoppingCart className="w-5 h-5" /> Current Bill
                  </h2>
                  <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-700/50">
                      {cart.length} ITEMS
                  </span>
                </div>

                <div className="lg:flex-1 lg:overflow-y-auto">
                  <BillCart
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onUpdatePrice={updatePrice}
                    onRemove={removeFromCart}
                    onBlurQuantity={handleBlurQuantity}
                  />
                </div>

                <BillForm
                  customerName={customerName}
                  setCustomerName={setCustomerName}
                  customerPhone={customerPhone}
                  setCustomerPhone={setCustomerPhone}
                  customerAddress={customerAddress}
                  setCustomerAddress={setCustomerAddress}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  total={total}
                  loading={loading}
                  cartEmpty={cart.length === 0}
                  onSubmit={handleSubmit}
                />
              </Card>
            </div>
         </div>
      )}
    </div>
  );
};

export default Billing;
