import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import { Product } from "../types";
import { ProductGrid } from "../components/billing/ProductGrid";
import { BillCart, CartItem } from "../components/billing/BillCart";
import { BillForm } from "../components/billing/BillForm";
import { BillHistory } from "../components/billing/BillHistory";
import { ShoppingCart, History, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

const Billing: React.FC = () => {
  const { showToast } = useToast();
  // Mode State: 'create' or 'history'
  const [mode, setMode] = useState<"create" | "history">("create");

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | "pending">("cash");

  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await api.products.list();
      setProducts(data.filter(p => p.is_active));
    } catch (err) {
      showToast("Failed to fetch products", "error");
    }
  }, [showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ---------------- LOGIC ---------------- */

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
    // 1. Prevent double submission and empty cart
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

      // 2. Refresh products to update stock quantities locally
      await fetchProducts();

      // 3. Reset UI
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
    <div className="p-4 h-screen lg:overflow-hidden flex flex-col">
      
      {/* HEADER / MODE TOGGLE */}
      <div className="flex justify-center mb-6 shrink-0">
          <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex gap-1 shadow-sm">
              <Button
                variant={mode === "create" ? "primary" : "ghost"}
                size="md"
                onClick={() => setMode("create")}
                className={cn(
                   "px-6 rounded-xl",
                   mode === "create" ? "shadow-md" : "text-neutral-500"
                )}
                icon={<Plus size={16} />}
              >
                 New Bill
              </Button>
              <Button
                variant={mode === "history" ? "primary" : "ghost"}
                size="md"
                onClick={() => setMode("history")}
                className={cn(
                   "px-6 rounded-xl",
                   mode === "history" ? "shadow-md" : "text-neutral-500"
                )}
                icon={<History size={16} />}
              >
                 History
              </Button>
          </div>
      </div>

      {/* CONDITIONAL RENDERING */}
      {mode === "history" ? (
         /* HISTORY VIEW */
         <div className="flex-1 overflow-y-auto pb-20">
            <BillHistory />
         </div>
      ) : (
         /* CREATE BILL VIEW (Split Screen) */
         <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden">
            {/* LEFT: PRODUCTS */}
            <div className="lg:col-span-5 h-full flex flex-col space-y-4 overflow-hidden">
              <ProductGrid products={products} onAddToCart={addToCart} />
            </div>

            {/* RIGHT: BILLING */}
            <div className="lg:col-span-7 flex flex-col lg:items-start h-full overflow-hidden">
              <Card className="w-full flex flex-col shadow-xl overflow-hidden p-0 h-full">
                
                {/* Header */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50 shrink-0">
                  <h2 className="font-black text-base flex gap-2 items-center tracking-tight">
                    <ShoppingCart className="w-5 h-5" /> Current Bill
                  </h2>
                  <Badge variant="default" className="bg-black text-white dark:bg-white dark:text-black px-3 py-1">
                    {cart.length} Items
                  </Badge>
                </div>

                <BillCart
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onUpdatePrice={updatePrice}
                  onRemove={removeFromCart}
                  onBlurQuantity={handleBlurQuantity}
                />

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
