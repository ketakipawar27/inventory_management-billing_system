import React, { useState } from "react";
import { api } from "../../api";
import { Product } from "../../types";
import { PlusCircle, Store, Package, IndianRupee } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

interface PurchaseFormProps {
  products: Product[];
  onSuccess: () => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ products, onSuccess }) => {
  const { showToast } = useToast();
  const [dealerName, setDealerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [pricePerUnit, setPricePerUnit] = useState<number | "">("");
  const [totalPrice, setTotalPrice] = useState<number | "">("");
  
  const [submitting, setSubmitting] = useState(false);

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
      
      showToast("Inventory updated successfully", "success");
      onSuccess();
    } catch (err: any) {
      showToast(err.message || "Failed to record restock", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:sticky lg:top-24">
      <Card className="p-4 sm:p-5 shadow-sm border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl bg-white dark:bg-neutral-900">
        {/* 1. Improved Visual Hierarchy */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="p-2 rounded-xl bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/5 dark:shadow-white/5">
            <PlusCircle size={16} strokeWidth={2.5} />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-sm font-black tracking-tight text-neutral-900 dark:text-white uppercase">New Restock</h2>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">Record received inventory</p>
          </div>
        </div>

        {/* 2 & 3. Compact Spacing & Stronger Label Contrast */}
        <div className="space-y-4">
          <Input
            label="SUPPLIER"
            placeholder="Dealer Name"
            value={dealerName}
            onChange={(e) => setDealerName(e.target.value)}
            icon={<Store size={14} className="text-neutral-400" />}
            className="h-10 text-xs bg-neutral-50/50 dark:bg-black/40 border-neutral-100 dark:border-neutral-800"
          />

          <Select
            label="PRODUCT"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            placeholder="Select product..."
            icon={<Package size={14} className="text-neutral-400" />}
            options={products.map(p => ({
              value: p.id,
              label: `${p.name} (${p.stock_quantity})`
            }))}
            className="h-10 text-xs"
          />

          <Input
            label="QUANTITY"
            type="number"
            placeholder="0"
            value={quantity}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="h-10 text-xs"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="UNIT COST"
              type="number"
              placeholder="0.00"
              value={pricePerUnit}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleUnitPriceChange(e.target.value)}
              icon={<IndianRupee size={12} className="text-neutral-400" />}
              className="h-10 text-xs"
            />
            <Input
              label="TOTAL COST"
              type="number"
              placeholder="0.00"
              value={totalPrice}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleTotalPriceChange(e.target.value)}
              icon={<IndianRupee size={12} className="text-emerald-500" />}
              className="h-10 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/20"
            />
          </div>

          {/* 4. Primary Action Emphasis */}
          <Button
            onClick={handleSubmit}
            isLoading={submitting}
            disabled={!dealerName || !selectedProductId || !quantity}
            className="w-full h-11 shadow-sm mt-2 text-[10px] font-black uppercase tracking-[0.2em] bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Confirm Purchase
          </Button>
        </div>
      </Card>
    </div>
  );
};
