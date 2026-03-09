import React, { useState } from "react";
import { api } from "../../api";
import { Product } from "../../types";
import { PlusCircle, Store, Package } from "lucide-react";
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
    <div className="lg:sticky lg:top-4">
      <Card className="p-6 space-y-6 shadow-xl">
        <div>
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <PlusCircle className="text-emerald-500" /> New Restock
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Record inventory received from suppliers.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Supplier"
            placeholder="Dealer Name"
            value={dealerName}
            onChange={(e) => setDealerName(e.target.value)}
            icon={<Store size={16} />}
          />

          <Select
            label="Product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            placeholder="Select product..."
            icon={<Package size={16} />}
            options={products.map(p => ({
              value: p.id,
              label: `${p.name} (Cur: ${p.stock_quantity})`
            }))}
          />

          <Input
            label="Quantity"
            type="number"
            placeholder="0"
            value={quantity}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleQuantityChange(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Unit Cost"
              type="number"
              placeholder="0.00"
              value={pricePerUnit}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleUnitPriceChange(e.target.value)}
              icon={<span className="text-xs font-bold">₹</span>}
            />
            <Input
              label="Total Cost"
              type="number"
              placeholder="0.00"
              value={totalPrice}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleTotalPriceChange(e.target.value)}
              icon={<span className="text-xs font-bold">₹</span>}
              className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900"
            />
          </div>

          <Button
            onClick={handleSubmit}
            isLoading={submitting}
            disabled={!dealerName || !selectedProductId}
            className="w-full py-4 shadow-lg mt-4"
          >
            Confirm Purchase
          </Button>
        </div>
      </Card>
    </div>
  );
};
