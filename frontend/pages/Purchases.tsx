import React, { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "../api";
import { Product, Purchase } from "../types";
import { PurchaseForm } from "../components/purchases/PurchaseForm";
import { PurchaseFilters } from "../components/purchases/PurchaseFilters";
import { PurchaseList } from "../components/purchases/PurchaseList";
import { useToast } from "../context/ToastContext";
import { Badge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";

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
        api.categories.list().then(cats => api.purchases.list()), // Assuming categories might be needed or just following previous logic
      ]);
      // The previous logic for pur was simpler:
      const purData = await api.purchases.list();

      setProducts(prod);
      setPurchases(
        purData.sort(
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
    <div className="min-h-screen pb-20 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Page Header */}
        <PageHeader
          description="Manage and track stock restock orders from suppliers"
          className="pt-4"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 2. Restock Form (LEFT/TOP) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <PurchaseForm products={products} onSuccess={fetchData} />
          </div>

          {/* RIGHT/BOTTOM: History, Filters, and List */}
          <div className="lg:col-span-8 space-y-6">
            {/* 3. History Header */}
            <div className="flex justify-between items-center px-1">
              <div className="space-y-0.5">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                  History
                </h2>
                <p className="text-neutral-500 text-xs font-medium">
                  Recent restock transactions
                </p>
              </div>
              <Badge variant="outline" className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider h-fit">
                {filteredPurchases.length} Records
              </Badge>
            </div>

            {/* 4. Filters Section */}
            <div className="bg-white dark:bg-neutral-900 p-1 rounded-2xl">
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

            {/* 5. Purchase Records List */}
            <div className="pb-10">
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
    </div>
  );
};

export default Purchases;
