import React, { useState, useRef, useEffect } from "react";
import { Product } from "../../types";
import { Search, Barcode } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

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
      <Input
        ref={inputRef}
        placeholder="Search product or variant (Ctrl+F)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        icon={<Search size={16} />}
        className="shadow-sm"
      />

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 content-start scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
        {filteredProducts.map((p) => (
          <button
            key={p.id}
            onClick={() => onAddToCart(p)}
            disabled={p.stock_quantity === 0}
            className={cn(
              "p-3 rounded-2xl text-left transition-all relative group flex flex-col justify-between h-28 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-lg active:scale-95",
              p.stock_quantity === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-black dark:hover:border-white"
            )}
          >
            <div className="space-y-0.5">
              <div className="font-black text-xs sm:text-sm line-clamp-2 leading-tight tracking-tight">
                {p.name}
              </div>
              {p.variant && (
                <div className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">
                  {p.variant}
                </div>
              )}
            </div>
            <div className="mt-auto w-full flex justify-between items-end">
              <Badge
                variant={p.stock_quantity <= 5 ? "error" : "default"}
                className="px-1.5 py-0.5 text-[8px]"
              >
                {p.stock_quantity} IN STOCK
              </Badge>
              <div className="text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-lg uppercase tracking-widest">
                Add
              </div>
            </div>
          </button>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center text-neutral-400 text-sm font-medium italic border-2 border-dashed border-neutral-100 dark:border-neutral-900 rounded-3xl">
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
};
