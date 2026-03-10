import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../api";
import { Bill } from "../../types";
import {
  Search,
  Calendar,
  User,
  Phone,
  Clock,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { cn } from "../../lib/utils";

type FilterType = "all" | "pending" | "cash" | "online";

export const BillHistory: React.FC = () => {
  const { showToast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<FilterType>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.bills.list();
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
      showToast(`Status updated`, "success");
    } catch {
      showToast("Update failed", "error");
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
      (b.customer_phone && b.customer_phone.includes(searchTerm));

    const matchesStatus =
      filterMode === "all" || b.payment_method === filterMode;

    return matchesSearch && matchesStatus;
  });

  const totalPendingAmount = bills
    .filter((b) => b.payment_method === "pending")
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-1 sm:px-0 pb-10 overflow-visible">
      {/* PENDING SUMMARY - COMPACT */}
      <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 shrink-0">
          <Clock size={20} />
        </div>
        <div>
          <div className="text-[9px] font-black text-amber-600/80 dark:text-amber-500 uppercase tracking-widest leading-none mb-1">
            Pending Amount
          </div>
          <div className="text-xl font-black tracking-tight leading-none text-neutral-900 dark:text-white">
            ₹{totalPendingAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* SEARCH + DROP DOWN FILTER */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        <div className="flex-1 relative group min-w-0">
          <Input
            placeholder="Search name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} className="text-neutral-400" />}
            className="h-10 text-xs bg-neutral-50/50 dark:bg-black/30 border-transparent rounded-xl px-4 pl-10"
          />
        </div>

        <div className="w-full sm:w-[160px] shrink-0">
          <Select
            fullWidth
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterType)}
            icon={<Filter size={14} className="text-neutral-400" />}
            className="h-10 text-[11px] font-bold uppercase tracking-tight rounded-xl px-3 bg-neutral-50/50 dark:bg-black/30 border-transparent shadow-none"
            options={[
              { value: "all", label: "All Bills" },
              { value: "pending", label: "Pending" },
              { value: "cash", label: "Cash" },
              { value: "online", label: "Online" },
            ]}
          />
        </div>
      </div>

      {/* BILL LIST - GRID VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBills.length === 0 ? (
          <div className="col-span-full text-center py-20 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] italic border-2 border-dashed border-neutral-100 dark:border-neutral-900 rounded-2xl">
            No matching records
          </div>
        ) : (
          filteredBills.map((bill) => (
            <Card
              key={bill.id}
              className={cn(
                "p-4 group border-neutral-200/50 dark:border-neutral-800/50 shadow-sm rounded-2xl bg-white dark:bg-neutral-900 transition-all",
                bill.payment_method === "pending" && "border-amber-200 bg-amber-50/5 dark:bg-amber-900/5"
              )}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-neutral-50 dark:border-neutral-800/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "shrink-0 p-2 rounded-xl transition-all shadow-sm",
                    bill.payment_method === "pending"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                  )}>
                    <User size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[13px] text-neutral-900 dark:text-white truncate tracking-tight leading-tight">
                      {bill.customer_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[8px] font-bold text-neutral-400 mt-1 uppercase tracking-widest leading-none">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {bill.bill_date}
                      </span>
                      {bill.customer_phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={10} /> {bill.customer_phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5 leading-none">
                    TOTAL
                  </div>
                  <div className="text-sm font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                    ₹{Number(bill.total_amount).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Card Body - Items List */}
              <div className="space-y-1.5 mb-4 px-1">
                {(bill.items_detail || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] px-2 py-1.5 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30 border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 transition-all">
                    <div className="flex flex-col min-w-0">
                      <div className="font-bold text-neutral-800 dark:text-neutral-200 truncate uppercase tracking-tight">
                        {item.product_name || `Product #${item.product_id}`}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black text-neutral-500 dark:text-neutral-400">
                          {item.quantity} UNITS
                        </span>
                        <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-tight">
                          @ ₹{Number(item.price_per_unit).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 opacity-20 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={12} className="text-neutral-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer - Compact Status Select */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-50 dark:border-neutral-800/50">
                <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">
                  PAYMENT MODE
                </div>
                <div className="w-[120px]">
                  <Select
                    fullWidth
                    direction="up"
                    value={bill.payment_method}
                    disabled={updatingId === bill.id}
                    onChange={(e) => handleStatusChange(bill.id, e.target.value)}
                    className={cn(
                      "h-8 text-[9px] font-black uppercase tracking-tight rounded-xl px-2.5",
                      bill.payment_method === 'pending'
                        ? 'bg-amber-100/50 border-amber-200 text-amber-700'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-700'
                    )}
                    options={[
                      { value: "cash", label: "Cash" },
                      { value: "online", label: "Online" },
                      { value: "pending", label: "Pending" },
                    ]}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};