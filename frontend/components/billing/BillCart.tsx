import React from "react";
import { Trash2, Package } from "lucide-react";
import { Product } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
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
    <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-neutral-100/50 dark:bg-black/20 min-h-[150px] scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-neutral-400 opacity-60 py-10">
          <div className="p-4 rounded-3xl bg-neutral-200 dark:bg-neutral-800 mb-4">
            <Package size={40} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest">No items selected</p>
        </div>
      ) : (
        cart.map((i) => (
          <Card
            key={i.product.id}
            className="p-3 border-neutral-200 dark:border-neutral-800 flex items-center gap-4 group hover:shadow-md"
          >
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm truncate tracking-tight" title={i.product.name}>
                {i.product.name}
              </div>
              <div className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                {i.product.variant || "Standard"}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col items-end w-16">
              <label className="text-[9px] uppercase text-neutral-400 font-black tracking-widest mb-0.5">Qty</label>
              <input
                type="number"
                min="1"
                value={i.quantity}
                onFocus={(e) => e.target.select()}
                onBlur={() => onBlurQuantity(i.product.id)}
                onChange={(e) => onUpdateQuantity(i.product.id, e.target.value)}
                className="w-full text-right font-black text-base bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col items-end w-20">
              <label className="text-[9px] uppercase text-neutral-400 font-black tracking-widest mb-0.5">Price</label>
              <div className="flex items-center justify-end w-full">
                <span className="text-neutral-400 text-xs font-bold mr-0.5">₹</span>
                <input
                  type="number"
                  value={i.price}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdatePrice(i.product.id, Number(e.target.value))}
                  className="w-full text-right font-black text-base bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Line Total */}
            <div className="w-20 text-right hidden sm:block">
              <div className="text-[9px] uppercase text-neutral-400 font-black tracking-widest mb-0.5">Total</div>
              <div className="font-black text-sm tracking-tight">
                ₹{((Number(i.quantity) || 0) * i.price).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(i.product.id)}
              className="text-neutral-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              icon={<Trash2 size={16} />}
            />
          </Card>
        ))
      )}
    </div>
  );
};
