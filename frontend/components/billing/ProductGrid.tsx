import React, { useState } from "react";
import { Product } from "../../types";
import { Search } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Search Bar */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
        <input
          placeholder="Search products…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
        />
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 content-start">
        {filteredProducts.map((p) => (
          <button
            key={p.id}
            onClick={() => onAddToCart(p)}
            disabled={p.stock_quantity === 0}
            className={`
              p-3 rounded-xl text-left transition relative group flex flex-col justify-between
              bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 h-20 hover:shadow-md
              ${p.stock_quantity === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-black dark:hover:border-neutral-500"}
            `}
          >
            <div className="font-semibold text-xs sm:text-sm line-clamp-2 leading-tight">
              {p.name}
            </div>
            <div className="mt-auto w-full pt-2">
              <div className="text-[10px] text-neutral-400 font-medium">
                Stock: {p.stock_quantity}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};