import React, { useEffect, useState, useCallback } from "react";
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
import { useToast } from "../../context/ToastContext";

export const BillHistory: React.FC = () => {
  const { showToast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBillId, setExpandedBillId] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "pending">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.bills.list();
      // Ensure bills is an array before sorting
      const billsArray = Array.isArray(data) ? data : [];
      setBills(
        billsArray.sort(
          (a: any, b: any) =>
            new Date(b.bill_date).getTime() -
            new Date(a.bill_date).getTime()
        )
      );
    } catch (err) {
      showToast("Failed to fetch bill history", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const oldBills = [...bills];
    setBills((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, payment_method: newStatus as any } : b
      )
    );
    setUpdatingId(id);

    try {
      await api.bills.update(id, { payment_method: newStatus as any });
      showToast(`Bill #${id} status updated to ${newStatus}`, "success");
    } catch {
      showToast("Failed to update bill status", "error");
      setBills(oldBills);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      (b.customer_name || "")
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
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

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
          <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full text-amber-600">
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

        <div className="md:col-span-2 bg-white dark:bg-neutral-900 p-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex gap-2">
          <button
            onClick={() => setFilterMode("all")}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
              filterMode === "all"
                ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            <Filter size={14} className="inline mr-1" />
            All Bills
          </button>
          <button
            onClick={() => setFilterMode("pending")}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
              filterMode === "pending"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 outline-none transition-all"
        />
      </div>

      {/* BILL LIST */}
      <div className="space-y-4">
        {filteredBills.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-medium">
            No records found.
          </div>
        ) : (
          filteredBills.map((bill) => (
            <div
              key={bill.id}
              className={`border rounded-2xl overflow-hidden transition-all ${
                bill.payment_method === "pending"
                  ? "border-amber-300 bg-amber-50/10 dark:border-amber-900/50"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
              }`}
            >
              {/* HEADER */}
              <div
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center cursor-pointer gap-4"
                onClick={() =>
                  setExpandedBillId(
                    expandedBillId === bill.id ? null : bill.id
                  )
                }
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">{bill.customer_name}</div>
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

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <select
                    value={bill.payment_method}
                    disabled={updatingId === bill.id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleStatusChange(bill.id, e.target.value)
                    }
                    className={`
                      text-[10px] font-black uppercase tracking-wider rounded-lg px-2.5 py-1.5 border outline-none
                      ${bill.payment_method === 'pending' ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'}
                    `}
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="pending">Pending</option>
                  </select>

                  <div className="text-right">
                    <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Total</div>
                    <div className="font-black text-lg">
                      ₹{Number(bill.total_amount).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-neutral-400">
                    {expandedBillId === bill.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* DETAILS */}
              {expandedBillId === bill.id && (
                <div className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/20 p-4">
                  <div className="text-[10px] font-black uppercase text-neutral-400 mb-3 flex items-center gap-1 tracking-widest">
                    <Package size={12} /> Items Breakdown
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                          <th className="pb-2">Product</th>
                          <th className="pb-2 text-right">Qty</th>
                          <th className="pb-2 text-right">Rate</th>
                          <th className="pb-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(bill.items_detail || []).map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-0 hover:bg-white/40 dark:hover:bg-neutral-800/20 transition-colors">
                            <td className="py-2.5 font-bold text-neutral-700 dark:text-neutral-300">
                              {item.product_name || `Product #${item.product_id}`}
                            </td>
                            <td className="py-2.5 text-right font-medium">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 text-right text-neutral-500">
                              ₹{Number(item.price_per_unit).toLocaleString()}
                            </td>
                            <td className="py-2.5 text-right font-bold text-neutral-900 dark:text-white">
                              ₹{Number(item.total_price).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {bill.customer_address && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
                      <strong className="text-neutral-400 uppercase text-[10px] block mb-1">Shipping Address</strong>
                      {bill.customer_address}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
