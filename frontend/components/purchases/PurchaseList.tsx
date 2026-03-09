import React from "react";
import { Product, Purchase } from "../../types";
import { History, Store, Calendar, ArrowDownLeft, IndianRupee } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface PurchaseListProps {
  purchases: Purchase[];
  products: Product[];
  loading: boolean;
  onClearFilters?: () => void;
  hasActiveFilters: boolean;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({
  purchases,
  products,
  loading,
  onClearFilters,
  hasActiveFilters,
}) => {
  const getProductDetails = (id: number) => {
    return products.find((p) => p.id === id);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl animate-pulse bg-neutral-100 dark:bg-neutral-900" />
        ))}
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-400 italic bg-white dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center">
        <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800 mb-4 text-neutral-300">
          <History size={40} strokeWidth={1} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest">No matching records</p>
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="mt-4 text-emerald-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest"
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {purchases.map((p) => (
        <Card
          key={p.id}
          hoverable
          className="p-3 sm:p-3.5 group border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl bg-white dark:bg-neutral-900"
        >
          {/* Header - Level Hierarchy */}
          <div className="flex justify-between items-start mb-3 pb-2.5 border-b border-neutral-50 dark:border-neutral-800/50">
            <div className="flex items-center gap-2.5">
              <div className="shrink-0 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-all">
                <Store size={15} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[13px] text-neutral-900 dark:text-white truncate tracking-tight leading-tight">
                  {p.dealer_name}
                </h3>
                <div className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">
                  <Calendar size={9} />
                  {new Date(p.purchase_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">
                Total Paid
              </div>
              <div className="text-sm font-black tracking-tight text-neutral-900 dark:text-white flex items-center justify-end gap-0.5">
                <IndianRupee size={11} strokeWidth={3} className="text-neutral-400" />
                {p.total_amount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Items List - Tight Scannability */}
          <div className="space-y-1">
            {p.items?.map((item, index) => {
              const productDetails = getProductDetails(item.product_id);
              return (
                <div key={index} className="flex items-center justify-between text-[10px] px-2 py-1.5 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30 border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 transition-all">
                  <div className="flex flex-col min-w-0">
                    <div className="font-bold text-neutral-800 dark:text-neutral-200 truncate">
                      {productDetails?.name || `Product ID: ${item.product_id}`}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="success" className="px-1 py-0 text-[7px] font-black tracking-tighter shrink-0 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none">
                        +{item.quantity} UNITS
                      </Badge>
                      <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-tight">
                        @ ₹{item.price_per_unit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <ArrowDownLeft size={11} className="text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};
