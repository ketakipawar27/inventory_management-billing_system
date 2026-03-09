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
    <Card className="p-4 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-sm font-black text-neutral-800 dark:text-white mb-2 uppercase tracking-widest">
        <Filter size={16} /> Filters
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search Dealer..."
            value={filterDealer}
            onChange={(e) => setFilterDealer(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        <Select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value ? Number(e.target.value) : "")}
          placeholder="All Products"
          icon={<Package size={16} />}
          options={products.map(p => ({ value: p.id, label: p.name }))}
        />

        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          icon={<Calendar size={16} />}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest"
            icon={<X size={14} />}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </Card>
  );
};
