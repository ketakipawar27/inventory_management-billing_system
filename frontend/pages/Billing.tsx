import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Product } from "../types";
import { ProductGrid } from "../components/billing/ProductGrid";
import { BillCart, CartItem } from "../components/billing/BillCart";
import { BillForm } from "../components/billing/BillForm";
import { BillHistory } from "../components/billing/BillHistory"; // Import the new component
import { ShoppingCart, CheckCircle2, History, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Billing: React.FC = () => {
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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.products.list().then(setProducts).catch(console.error);
  }, []);

  /* ---------------- LOGIC ---------------- */

  const addToCart = (product: Product) => {
    if (cart.find((c) => c.product.id === product.id)) return;
    setCart([...cart, { product, quantity: 1, price: product.unit_price }]);
  };

  const updateQuantity = (id: number, value: string) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.product.id !== id) return i;
        if (value === "") return { ...i, quantity: "" };
        const qty = Number(value);
        const safeQty = Math.min(qty, i.product.stock_quantity);
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
    if (!customerName || cart.length === 0) return;
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

      // Reset
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setPaymentMethod("cash");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Billing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 h-screen lg:overflow-hidden flex flex-col">
      
      {/* HEADER / MODE TOGGLE */}
      <div className="flex justify-center mb-6 shrink-0">
          <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex gap-1 shadow-sm">
              <button 
                onClick={() => setMode("create")}
                className={`
                   px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                   ${mode === "create" ? "bg-black text-white dark:bg-white dark:text-black shadow-md" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}
                `}
              >
                 <Plus size={16} /> New Bill
              </button>
              <button 
                onClick={() => setMode("history")}
                className={`
                   px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                   ${mode === "history" ? "bg-black text-white dark:bg-white dark:text-black shadow-md" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}
                `}
              >
                 <History size={16} /> History
              </button>
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
              <div className="w-full rounded-3xl flex flex-col shadow-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 h-full">
                
                {/* Header */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50 shrink-0">
                  <h2 className="font-bold text-base flex gap-2 items-center">
                    <ShoppingCart className="w-5 h-5" /> Current Bill
                  </h2>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black">
                    {cart.length} Items
                  </span>
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
              </div>
            </div>
         </div>
      )}

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black text-white dark:bg-white dark:text-black shadow-2xl px-6 py-3 rounded-full font-bold flex items-center gap-2 text-sm"
          >
            <CheckCircle2 size={18} className="text-emerald-500" />
            Bill Generated
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Billing;