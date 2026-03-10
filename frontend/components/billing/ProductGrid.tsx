import React, { useState, useRef, useEffect } from "react";
import { Product, Category } from "../../types";
import { Search, Plus, Filter } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { cn } from "../../lib/utils";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  onAddToCart
}) => {
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<number | "all">("all");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredProducts = products.filter((p) => {
    const categoryName =
      categories.find((c) => c.id === p.category)?.name || "";

    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.variant &&
        p.variant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      searchTerm.trim() !== "" &&
      filteredProducts.length > 0
    ) {
      const firstProduct = filteredProducts[0];

      if (firstProduct.stock_quantity > 0) {
        onAddToCart(firstProduct);
        setSearchTerm("");
      } else {
        showToast(`${firstProduct.name} is out of stock`, "error");
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4 h-full bg-white dark:bg-black p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm overflow-visible">

      {/* Search + Filter */}
      <div className="shrink-0 flex items-center gap-2">

        <div className="flex-1 min-w-0">
          <Input
            ref={inputRef}
            placeholder="Search products... (Ctrl+F)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            icon={<Search size={16} />}
            className="h-10 text-xs shadow-sm bg-neutral-100/50 dark:bg-neutral-900 border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 rounded-xl px-3"
          />
        </div>

        {/* Compact Category Filter - Updated to match Purchase History Style */}
        <div className="w-[150px] shrink-0">
          <Select
            fullWidth={false}
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            icon={<Filter size={14} className="text-neutral-400" />}
            placeholder="Category"
            className="w-[150px] h-10 text-xs rounded-xl bg-neutral-100/50 dark:bg-neutral-900/50 border-transparent"
            options={[
              { value: "all", label: "All Categories" },
              ...categories.map((c) => ({
                value: c.id,
                label: c.name
              }))
            ]}
          />
        </div>

      </div>

      {/* Product Grid */}
      <div className="lg:flex-1 lg:overflow-y-auto pb-4 pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 content-start scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">

        {filteredProducts.map((p) => {
          const isLowStock = p.stock_quantity <= p.min_stock;

          const categoryName =
            categories.find((c) => c.id === p.category)?.name || "General";

          return (
            <button
              key={p.id}
              onClick={() => onAddToCart(p)}
              disabled={p.stock_quantity === 0}
              className={cn(
                "p-3 rounded-xl text-left transition-all relative group flex flex-col justify-between h-28 bg-white dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 hover:border-black dark:hover:border-white hover:shadow-md active:scale-95 shadow-sm",
                p.stock_quantity === 0 && "opacity-40 cursor-not-allowed"
              )}
            >
              <div className="space-y-1 min-w-0">

                <div className="text-[8px] font-bold uppercase tracking-wider text-neutral-400 truncate">
                  {categoryName}
                </div>

                <div className="font-bold text-sm line-clamp-2 leading-tight tracking-tight text-neutral-800 dark:text-neutral-100">
                  {p.name}
                </div>

              </div>

              <div className="w-full flex justify-between items-end">

                <div
                  className={cn(
                    "px-2 py-1 rounded-lg flex items-center gap-1.5 border",
                    isLowStock
                      ? "bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20"
                      : "bg-neutral-100 border-neutral-200/80 dark:bg-neutral-800 dark:border-neutral-700/50"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-bold tracking-tight leading-none",
                      isLowStock
                        ? "text-rose-600"
                        : "text-neutral-800 dark:text-neutral-100"
                    )}
                  >
                    {p.stock_quantity}
                  </span>

                  <span
                    className={cn(
                      "text-[7px] font-bold uppercase tracking-widest leading-none",
                      isLowStock
                        ? "text-rose-500"
                        : "text-neutral-400 dark:text-neutral-500"
                    )}
                  >
                    Stock
                  </span>
                </div>

                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black opacity-0 group-hover:opacity-100 transition-all shadow-lg absolute bottom-3 right-3 transform translate-y-1 group-hover:translate-y-0">
                  <Plus size={12} strokeWidth={3} />
                </div>

              </div>
            </button>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-400 text-xs font-bold uppercase tracking-[0.2em] italic border-2 border-dashed border-neutral-100 dark:border-neutral-900 rounded-2xl">
            No Products Found
          </div>
        )}

      </div>
    </div>
  );
};