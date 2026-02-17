import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { Bill } from "../../types";
import {
  Search,
  Calendar,
  User,
  Phone,
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";

export const BillHistory: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBillId, setExpandedBillId] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "pending">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = () => {
    setLoading(true);
    api.bills
      .list()
      .then((data) => {
        setBills(
          data.sort(
            (a: any, b: any) =>
              new Date(b.bill_date).getTime() -
              new Date(a.bill_date).getTime()
          )
        );
      })
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const oldBills = [...bills];
    setBills((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, payment_method: newStatus } : b
      )
    );
    setUpdatingId(id);

    try {
      await api.bills.update(id, { payment_method: newStatus });
    } catch {
      alert("Failed to update status");
      setBills(oldBills);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (b.customer_phone &&
        b.customer_phone.includes(searchTerm));
    const matchesStatus =
      filterMode === "all" || b.payment_method === "pending";
    return matchesSearch && matchesStatus;
  });

  const totalPendingAmount = bills
    .filter((b) => b.payment_method === "pending")
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SUMMARY & FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-2xl border flex gap-4">
          <div className="p-3 bg-amber-100 rounded-full">
            <Clock />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase">
              Pending Amount
            </div>
            <div className="text-2xl font-black">
              ₹{totalPendingAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-neutral-900 p-2 rounded-2xl border flex gap-2">
          <button
            onClick={() => setFilterMode("all")}
            className={`flex-1 py-2 rounded-xl font-bold text-sm ${
              filterMode === "all"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-neutral-500"
            }`}
          >
            <Filter size={14} className="inline mr-1" />
            All Bills
          </button>
          <button
            onClick={() => setFilterMode("pending")}
            className={`flex-1 py-2 rounded-xl font-bold text-sm ${
              filterMode === "pending"
                ? "bg-amber-500 text-white"
                : "text-neutral-500"
            }`}
          >
            <AlertCircle size={14} className="inline mr-1" />
            Pending Only
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
        <input
          placeholder="Search customer name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border"
        />
      </div>

      {/* BILL LIST */}
      <div className="space-y-4">
        {filteredBills.map((bill) => (
          <div
            key={bill.id}
            className={`border rounded-2xl overflow-hidden ${
              bill.payment_method === "pending"
                ? "border-amber-300"
                : "border-neutral-200 dark:border-neutral-800"
            }`}
          >
            {/* HEADER */}
            <div
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() =>
                setExpandedBillId(
                  expandedBillId === bill.id ? null : bill.id
                )
              }
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <User />
                </div>
                <div>
                  <div className="font-bold">{bill.customer_name}</div>
                  <div className="text-xs text-neutral-500 flex gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {bill.bill_date}
                    </span>
                    {bill.customer_phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {bill.customer_phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={bill.payment_method}
                  disabled={updatingId === bill.id}
                  onChange={(e) =>
                    handleStatusChange(bill.id, e.target.value)
                  }
                  className="text-xs font-bold rounded-lg px-2 py-1 border"
                >
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="pending">Pending</option>
                </select>

                <div className="text-right">
                  <div className="text-xs text-neutral-400">Total</div>
                  <div className="font-black text-lg">
                    ₹{bill.total_amount}
                  </div>
                </div>

                {expandedBillId === bill.id ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>
            </div>

            {/* DETAILS */}
            {expandedBillId === bill.id && (
              <div className="border-t bg-neutral-50 dark:bg-black/30 p-4">
                <div className="text-xs font-bold uppercase text-neutral-500 mb-2 flex items-center gap-1">
                  <Package size={12} /> Items
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left text-xs text-neutral-400 border-b">
                        <th className="py-2">Product</th>
                        <th className="py-2 text-right">Qty</th>
                        <th className="py-2 text-right">Rate</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* ✅ FIX 1: Use 'items' instead of 'items_detail' */}
                      {bill.items.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-2 font-medium">
                            {/* ✅ FIX 2: Use 'item.product' as the fallback ID */}
                            {item.product_name || `Product #${item.product}`}
                          </td>
                          <td className="py-2 text-right">
                            {item.quantity}
                          </td>
                          <td className="py-2 text-right">
                            {/* Ensure this matches backend field (price_per_unit) */}
                            ₹{item.price_per_unit}
                          </td>
                          <td className="py-2 text-right font-semibold">
                            ₹{item.total_price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {bill.customer_address && (
                  <div className="mt-3 text-xs text-neutral-500">
                    <strong>Address:</strong>{" "}
                    {bill.customer_address}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
