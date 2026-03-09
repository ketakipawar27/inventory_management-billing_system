import React, { useState, useRef, useEffect } from "react";
import { Product } from "../../types";
import { Search, Barcode } from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input on load and on 'Ctrl+F'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.variant && p.variant.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Logic to handle "Enter" in search to add the first matching product
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim() !== "" && filteredProducts.length > 0) {
      const firstProduct = filteredProducts[0];
      if (firstProduct.stock_quantity > 0) {
        onAddToCart(firstProduct);
        setSearchTerm(""); // Clear search after adding
      } else {
        showToast(`${firstProduct.name} is out of stock`, "error");
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Search Bar */}
      <div className="relative shrink-0 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
        <input
          ref={inputRef}
          placeholder="Search product or variant (Ctrl+F)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl py-3 pl-10 pr-10 text-sm outline-none bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
           <Barcode size={16} className="text-neutral-300" />
        </div>
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
              bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 h-24 hover:shadow-md
              ${p.stock_quantity === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-black dark:hover:border-neutral-500"}
            `}
          >
            <div className="font-semibold text-xs sm:text-sm line-clamp-2 leading-tight">
              {p.name}
              {p.variant && (
                <span className="block text-[10px] text-neutral-400 font-normal mt-0.5">
                  {p.variant}
                </span>
              )}
            </div>
            <div className="mt-auto w-full flex justify-between items-end">
              <div className={`text-[10px] font-bold ${p.stock_quantity <= 5 ? 'text-rose-500' : 'text-neutral-400'}`}>
                {p.stock_quantity} in stock
              </div>
              <div className="text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded uppercase">
                Add
              </div>
            </div>
          </button>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-10 text-center text-neutral-400 text-sm">
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
};
