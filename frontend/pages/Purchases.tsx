import React, { useEffect, useState, useMemo } from "react";
import { api } from "../api";
import { Product, Purchase } from "../types";
import { PurchaseForm } from "../components/purchases/PurchaseForm";
import { PurchaseFilters } from "../components/purchases/PurchaseFilters";
import { PurchaseList } from "../components/purchases/PurchaseList";

const Purchases: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State (Updated to Single Date)
  const [filterDealer, setFilterDealer] = useState("");
  const [filterProduct, setFilterProduct] = useState<number | "">("");
  const [filterDate, setFilterDate] = useState("");

  const fetchData = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Logic (Memoized for performance)
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      // 1. Dealer Name
      const matchDealer = p.dealer_name
        .toLowerCase()
        .includes(filterDealer.toLowerCase());

      // 2. Product (Checks if ANY item in the purchase matches the ID)
      const matchProduct =
        filterProduct === "" ||
        p.items.some((item) => item.product_id === filterProduct);

      // 3. Date (Exact Match)
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-4">
      {/* LEFT: ENTRY FORM */}
      <div className="lg:col-span-4">
        <PurchaseForm products={products} onSuccess={fetchData} />
      </div>

      {/* RIGHT: HISTORY LIST & FILTERS */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3">
              History
            </h2>
            <p className="text-neutral-500 text-sm">
              Manage and filter purchase records
            </p>
          </div>
          <div className="text-xs font-bold px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full">
            {filteredPurchases.length} Found
          </div>
        </div>

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

        <PurchaseList
          purchases={filteredPurchases}
          products={products}
          loading={loading}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  );
};

export default Purchases;