import React from "react";
import { Trash2, Package } from "lucide-react";
import { Product } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { cn } from "../../lib/utils";

export type CartItem = {
  product: Product;
  quantity: number | "";
  price: number;
};

interface BillCartProps {
  cart: CartItem[];
  onUpdateQuantity: (id: number, val: string) => void;
  onUpdatePrice: (id: number, val: number) => void;
  onRemove: (id: number) => void;
  onBlurQuantity: (id: number) => void;
}

export const BillCart: React.FC<BillCartProps> = ({
  cart,
  onUpdateQuantity,
  onUpdatePrice,
  onRemove,
  onBlurQuantity,
}) => {
  return (
    <div className="flex-1 p-3 space-y-2 lg:overflow-y-auto bg-neutral-100/50 dark:bg-black/20 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
      {cart.length === 0 ? (
        <div className="h-full flex items-center justify-center py-10 lg:py-0">
          <EmptyState
            icon={Package}
            title="No Items Selected"
            description="Add products to get started"
            className="scale-90"
          />
        </div>
      ) : (
        cart.map((i) => (
          <Card
            key={i.product.id}
            className="p-2.5 border-neutral-200/60 dark:border-neutral-800/60 flex items-center gap-3 group hover:shadow-md transition-all rounded-xl shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs truncate leading-tight" title={i.product.name}>
                {i.product.name}
              </div>
              <div className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider truncate">
                {i.product.variant || "Standard"}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col items-center w-14 shrink-0">
              <label className="text-[8px] uppercase text-neutral-400 font-bold tracking-widest mb-0.5">Qty</label>
              <input
                type="number"
                min="1"
                value={i.quantity}
                onFocus={(e) => e.target.select()}
                onBlur={() => onBlurQuantity(i.product.id)}
                onChange={(e) => onUpdateQuantity(i.product.id, e.target.value)}
                className="w-full text-center font-bold text-sm bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none h-6"
                placeholder="0"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col items-center w-20 shrink-0">
              <label className="text-[8px] uppercase text-neutral-400 font-bold tracking-widest mb-0.5">Price</label>
              <div className="flex items-center justify-center w-full">
                <span className="text-neutral-400 text-[9px] font-bold mr-0.5">₹</span>
                <input
                  type="number"
                  value={i.price}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdatePrice(i.product.id, Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none h-6"
                />
              </div>
            </div>

            {/* Total (Hidden on small) */}
            <div className="w-20 text-right hidden sm:block shrink-0">
              <div className="text-[8px] uppercase text-neutral-400 font-bold tracking-widest mb-0.5">Total</div>
              <div className="font-bold text-sm tracking-tight">
                ₹{((Number(i.quantity) || 0) * i.price).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(i.product.id)}
              className="text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              icon={<Trash2 size={14} />}
            />
          </Card>
        ))
      )}
    </div>
  );
};
