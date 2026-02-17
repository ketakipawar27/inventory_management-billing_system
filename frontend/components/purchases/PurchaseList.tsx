import React from "react";
import { Product, Purchase } from "../../types";
import { History, Store, Calendar, ArrowDownLeft } from "lucide-react";

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
          <div key={i} className="h-24 rounded-2xl animate-pulse bg-neutral-100 dark:bg-neutral-900" />
        ))}
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-400 opacity-50 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800">
        <History className="mx-auto mb-4 w-12 h-12" strokeWidth={1} />
        <p>No matching records found</p>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-emerald-500 font-bold text-sm mt-2 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {purchases.map((p) => (
        <div
          key={p.id}
          className="group relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg transition-all"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                <Store size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  {p.dealer_name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                  <Calendar size={12} />
                  {new Date(p.purchase_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-neutral-400 uppercase mb-0.5">
                Total Paid
              </div>
              <div className="text-lg font-black tracking-tight">
                ₹{p.total_amount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            {p.items?.map((item, index) => {
              const productDetails = getProductDetails(item.product_id);
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-neutral-700 dark:text-neutral-300">
                      {productDetails?.name || `Product ID: ${item.product_id}`}
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                      +{item.quantity} QTY
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
                    <span className="text-[10px]">@</span>
                    <span>₹{item.price_per_unit}</span>
                    <ArrowDownLeft size={12} className="text-emerald-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};