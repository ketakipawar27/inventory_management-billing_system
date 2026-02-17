import React from "react";
import { Product } from "../../types";
import { Filter, Search, Package, X, Calendar } from "lucide-react";

interface PurchaseFiltersProps {
  products: Product[];
  filterDealer: string;
  setFilterDealer: (val: string) => void;
  filterProduct: number | "";
  setFilterProduct: (val: number | "") => void;
  filterDate: string; // Changed: Single date only
  setFilterDate: (val: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export const PurchaseFilters: React.FC<PurchaseFiltersProps> = ({
  products,
  filterDealer,
  setFilterDealer,
  filterProduct,
  setFilterProduct,
  filterDate,
  setFilterDate,
  onClear,
  hasActiveFilters,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-neutral-800 dark:text-white mb-2">
        <Filter size={16} /> Filters
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search Dealer - Takes up 2 columns */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            placeholder="Search Dealer..."
            value={filterDealer}
            onChange={(e) => setFilterDealer(e.target.value)}
            className="w-full rounded-lg py-2 pl-9 pr-3 text-sm bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 outline-none transition-colors"
          />
        </div>

        {/* Filter Product - Takes up 1 column */}
        <div className="relative">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value ? Number(e.target.value) : "")}
            className="w-full rounded-lg py-2 pl-9 pr-3 text-sm appearance-none bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 outline-none transition-colors"
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Date - Single Date Picker - Takes up 1 column */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 pointer-events-none" />
          <input
            type="date"
            placeholder="Select Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full rounded-lg py-2 pl-9 pr-3 text-sm bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 outline-none transition-colors appearance-none"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
          >
            <X size={12} /> Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};