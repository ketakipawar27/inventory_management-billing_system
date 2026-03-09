import React from "react";
import { Product } from "../../types";
import { Filter, Search, Package, X, Calendar } from "lucide-react";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

interface PurchaseFiltersProps {
  products: Product[];
  filterDealer: string;
  setFilterDealer: (val: string) => void;
  filterProduct: number | "";
  setFilterProduct: (val: number | "") => void;
  filterDate: string;
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
    <Card className="p-3 sm:p-4 shadow-sm border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 rounded-2xl">
      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 mb-3 uppercase tracking-widest px-1">
        <Filter size={14} className="text-neutral-300 dark:text-neutral-600" /> Filters
      </div>

      <div className="flex flex-col gap-3">
        {/* Search Dealer on top */}
        <div className="w-full">
          <Input
            placeholder="Search Dealer..."
            value={filterDealer}
            onChange={(e) => setFilterDealer(e.target.value)}
            icon={<Search size={14} className="text-neutral-400" />}
            className="h-9 text-xs bg-neutral-50/50 dark:bg-black/30 border-transparent rounded-xl"
          />
        </div>

        {/* Product and Date on the same row (Mobile and Desktop) */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value ? Number(e.target.value) : "")}
            placeholder="Product"
            icon={<Package size={14} className="text-neutral-400" />}
            options={products.map(p => ({ value: p.id, label: p.name }))}
            className="h-9 text-xs rounded-xl"
          />

          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            icon={<Calendar size={14} className="text-neutral-400" />}
            className="h-9 text-xs px-2 rounded-xl"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-3 mt-3 border-t border-neutral-50 dark:border-neutral-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-rose-500 hover:text-rose-600 font-black text-[9px] h-7 px-2 uppercase tracking-widest"
            icon={<X size={12} />}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </Card>
  );
};
