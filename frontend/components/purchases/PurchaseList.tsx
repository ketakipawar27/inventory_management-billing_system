import React from "react";
import { Product, Purchase } from "../../types";
import { History, Store, Calendar, ArrowDownLeft } from "lucide-react";
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
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-3xl animate-pulse bg-neutral-100 dark:bg-neutral-900" />
        ))}
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-400 italic bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center">
        <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800 mb-4 text-neutral-300">
          <History size={48} strokeWidth={1} />
        </div>
        <p className="font-medium">No matching records found</p>
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
    <div className="grid grid-cols-1 gap-4">
      {purchases.map((p) => (
        <Card
          key={p.id}
          hoverable
          className="p-6 group"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                <Store size={22} />
              </div>
              <div>
                <h3 className="font-black text-lg text-neutral-900 dark:text-white tracking-tight leading-tight">
                  {p.dealer_name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">
                  <Calendar size={12} />
                  {new Date(p.purchase_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-neutral-400 uppercase mb-0.5 tracking-widest">
                Total Paid
              </div>
              <div className="text-xl font-black tracking-tight">
                ₹{p.total_amount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {p.items?.map((item, index) => {
              const productDetails = getProductDetails(item.product_id);
              return (
                <div key={index} className="flex items-center justify-between text-sm p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="font-black text-neutral-800 dark:text-neutral-200 tracking-tight">
                      {productDetails?.name || `Product ID: ${item.product_id}`}
                    </div>
                    <Badge variant="success" className="px-2 py-0.5">
                      +{item.quantity} UNITS
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest">
                    <span>@ ₹{item.price_per_unit.toLocaleString('en-IN')}</span>
                    <ArrowDownLeft size={14} className="text-emerald-500" />
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
