import React from "react";
import { Trash2, Package } from "lucide-react";
import { Product } from "../../types";

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
    <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-neutral-100/50 dark:bg-black/20 min-h-[150px]">
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-neutral-400 opacity-60 py-10">
          <Package size={48} strokeWidth={1} className="mb-2" />
          <p className="text-sm">No items selected</p>
        </div>
      ) : (
        cart.map((i) => (
          <div
            key={i.product.id}
            className="rounded-lg p-3 bg-white dark:bg-neutral-950 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 group"
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate" title={i.product.name}>
                {i.product.name}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col items-end w-16">
              <label className="text-[9px] uppercase text-neutral-400 font-bold mb-0.5">Qty</label>
              <input
                type="number"
                min="1"
                value={i.quantity}
                onFocus={(e) => e.target.select()}
                onBlur={() => onBlurQuantity(i.product.id)}
                onChange={(e) => onUpdateQuantity(i.product.id, e.target.value)}
                className="w-full text-right font-mono text-base font-bold bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col items-end w-20">
              <label className="text-[9px] uppercase text-neutral-400 font-bold mb-0.5">Price</label>
              <div className="flex items-center justify-end w-full">
                <span className="text-neutral-400 text-xs mr-1">₹</span>
                <input
                  type="number"
                  value={i.price}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdatePrice(i.product.id, Number(e.target.value))}
                  className="w-full text-right font-mono text-base bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Line Total */}
            <div className="w-20 text-right hidden sm:block">
              <div className="text-[9px] uppercase text-neutral-400 font-bold mb-0.5">Total</div>
              <div className="font-bold text-sm">
                ₹{((Number(i.quantity) || 0) * i.price).toFixed(2)}
              </div>
            </div>

            <button
              onClick={() => onRemove(i.product.id)}
              className="p-2 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};