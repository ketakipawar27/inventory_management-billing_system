import React, { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "../api";
import { Product, Purchase } from "../types";
import { PurchaseForm } from "../components/purchases/PurchaseForm";
import { PurchaseFilters } from "../components/purchases/PurchaseFilters";
import { PurchaseList } from "../components/purchases/PurchaseList";
import { useToast } from "../context/ToastContext";
import { Badge } from "../components/ui/Badge";

const Purchases: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [filterDealer, setFilterDealer] = useState("");
  const [filterProduct, setFilterProduct] = useState<number | "">("");
  const [filterDate, setFilterDate] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [prod, pur] = await Promise.all([
        api.products.list(),
        api.purchases.list(),
      ]);
      setProducts(prod);
      setPurchases(
        pur.sort(
          (a: any, b: any) =>
            new Date(b.purchase_date).getTime() -
            new Date(a.purchase_date).getTime()
        )
      );
    } catch (err) {
      showToast("Failed to fetch purchase data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter Logic
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const matchDealer = p.dealer_name
        .toLowerCase()
        .includes(filterDealer.toLowerCase());

      const matchProduct =
        filterProduct === "" ||
        p.items.some((item) => item.product_id === filterProduct);

      const matchDate = !filterDate || p.purchase_date === filterDate;

      return matchDealer && matchProduct && matchDate;
    });
  }, [purchases, filterDealer, filterProduct, filterDate]);

  const clearFilters = () => {
    setFilterDealer("");
    setFilterProduct("");
    setFilterDate("");
  };

  const hasActiveFilters = !!(
    filterDealer ||
    filterProduct ||
    filterDate
  );

  return (
    <div className="h-[calc(100vh-2rem)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-4 h-full">
        {/* LEFT: ENTRY FORM */}
        <div className="lg:col-span-4 shrink-0">
          <PurchaseForm products={products} onSuccess={fetchData} />
        </div>

        {/* RIGHT: HISTORY LIST & FILTERS */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden space-y-6">
          <div className="flex justify-between items-end px-2 shrink-0">
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                History
              </h2>
              <p className="text-neutral-500 text-sm font-medium">
                Manage and filter purchase records
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1.5">
              {filteredPurchases.length} Found
            </Badge>
          </div>

          <div className="shrink-0">
            <PurchaseFilters
              products={products}
              filterDealer={filterDealer}
              setFilterDealer={setFilterDealer}
              filterProduct={filterProduct}
              setFilterProduct={setFilterProduct}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* SCROLLABLE LIST AREA */}
          <div className="flex-1 overflow-y-auto pr-2 pb-10 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
            <PurchaseList
              purchases={filteredPurchases}
              products={products}
              loading={loading}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchases;
