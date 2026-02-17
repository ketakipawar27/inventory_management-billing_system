import React, { useState } from "react";
import { api } from "../../api";
import { Product } from "../../types";
import { PlusCircle, Store, Package, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseFormProps {
  products: Product[];
  onSuccess: () => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ products, onSuccess }) => {
  const [dealerName, setDealerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [pricePerUnit, setPricePerUnit] = useState<number | "">("");
  const [totalPrice, setTotalPrice] = useState<number | "">("");
  
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Auto-Calculation Logic
  const handleUnitPriceChange = (val: string) => {
    const unit = parseFloat(val);
    setPricePerUnit(val === "" ? "" : unit);
    if (val !== "" && quantity && typeof quantity === "number") {
      setTotalPrice(Number((unit * quantity).toFixed(2)));
    }
  };

  const handleTotalPriceChange = (val: string) => {
    const total = parseFloat(val);
    setTotalPrice(val === "" ? "" : total);
    if (val !== "" && quantity && typeof quantity === "number" && quantity > 0) {
      setPricePerUnit(Number((total / quantity).toFixed(2)));
    }
  };

  const handleQuantityChange = (val: string) => {
    const qty = parseFloat(val);
    setQuantity(val === "" ? "" : qty);
    if (pricePerUnit && typeof pricePerUnit === "number" && val !== "") {
      setTotalPrice(Number((pricePerUnit * qty).toFixed(2)));
    }
  };

  const handleSubmit = async () => {
    if (!dealerName || !selectedProductId || !quantity || !pricePerUnit) return;

    setSubmitting(true);
    try {
      await api.purchases.create({
        dealer_name: dealerName,
        purchase_date: new Date().toISOString().slice(0, 10),
        items: [
          {
            product_id: Number(selectedProductId),
            quantity: Number(quantity),
            price_per_unit: Number(pricePerUnit),
          },
        ],
      });

      // Reset
      setDealerName("");
      setSelectedProductId("");
      setQuantity("");
      setPricePerUnit("");
      setTotalPrice("");
      
      // Trigger Success UI & Parent Refresh
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to record restock");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:sticky lg:top-4">
      <div className="rounded-3xl p-6 space-y-6 shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <PlusCircle className="text-emerald-500" /> New Restock
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Record inventory received from suppliers.
          </p>
        </div>

        <div className="space-y-4">
          {/* Supplier Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase">Supplier</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                placeholder="Dealer Name"
                value={dealerName}
                onChange={(e) => setDealerName(e.target.value)}
                className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Product Select */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase">Product</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none appearance-none bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="">Select product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Cur: {p.stock_quantity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase">Quantity</label>
            <input
              type="number"
              placeholder="0"
              value={quantity}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-full rounded-xl py-3 px-4 text-sm outline-none font-mono bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase">Unit Cost</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={pricePerUnit}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleUnitPriceChange(e.target.value)}
                  className="w-full rounded-xl py-3 pl-8 pr-4 text-sm outline-none font-mono bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase">Total Cost</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={totalPrice}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleTotalPriceChange(e.target.value)}
                  className="w-full rounded-xl py-3 pl-8 pr-4 text-sm outline-none font-mono font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !dealerName || !selectedProductId}
            className="w-full py-4 rounded-xl font-bold text-sm shadow-lg mt-4 bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            {submitting ? "Processing..." : "Confirm Purchase"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white shadow-2xl px-6 py-4 rounded-2xl font-bold flex items-center gap-3"
          >
            <CheckCircle2 className="text-white" />
            <div>
              <div className="text-sm">Success</div>
              <div className="text-xs opacity-80 font-normal">Inventory updated successfully</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};