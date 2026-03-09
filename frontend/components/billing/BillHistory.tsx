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
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

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
            className="h-32 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-3xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SUMMARY & FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 flex gap-4 bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">
              Pending Amount
            </div>
            <div className="text-2xl font-black tracking-tight">
              ₹{totalPendingAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 p-1.5 flex gap-1 items-center">
          <Button
            variant={filterMode === "all" ? "primary" : "ghost"}
            size="md"
            onClick={() => setFilterMode("all")}
            className="flex-1 rounded-xl"
            icon={<Filter size={14} />}
          >
            All Bills
          </Button>
          <Button
            variant={filterMode === "pending" ? "primary" : "ghost"}
            size="md"
            onClick={() => setFilterMode("pending")}
            className={cn(
              "flex-1 rounded-xl",
              filterMode === "pending" && "bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:text-white"
            )}
            icon={<AlertCircle size={14} />}
          >
            Pending Only
          </Button>
        </Card>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search customer name or phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={<Search size={18} />}
        className="shadow-sm"
      />

      {/* BILL LIST */}
      <div className="space-y-4">
        {filteredBills.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 font-medium italic border-2 border-dashed border-neutral-100 dark:border-neutral-900 rounded-3xl">
            No records found.
          </div>
        ) : (
          filteredBills.map((bill) => (
            <div
              key={bill.id}
              className={cn(
                "border rounded-3xl overflow-hidden transition-all",
                bill.payment_method === "pending"
                  ? "border-amber-300 bg-amber-50/10 dark:border-amber-900/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
              )}
            >
              {/* HEADER */}
              <div
                className="p-5 flex flex-col sm:flex-row justify-between sm:items-center cursor-pointer gap-4 group"
                onClick={() =>
                  setExpandedBillId(
                    expandedBillId === bill.id ? null : bill.id
                  )
                }
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="font-black text-neutral-900 dark:text-white tracking-tight">{bill.customer_name}</div>
                    <div className="text-[10px] font-bold text-neutral-400 flex gap-3 uppercase tracking-widest mt-0.5">
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

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <Select
                    value={bill.payment_method}
                    disabled={updatingId === bill.id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleStatusChange(bill.id, e.target.value)
                    }
                    className={cn(
                      "py-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest",
                      bill.payment_method === 'pending' ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
                    )}
                    options={[
                      { value: "cash", label: "Cash" },
                      { value: "online", label: "Online" },
                      { value: "pending", label: "Pending" },
                    ]}
                  />

                  <div className="text-right">
                    <div className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Total</div>
                    <div className="font-black text-xl tracking-tight">
                      ₹{Number(bill.total_amount).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="text-neutral-400 hidden sm:block">
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
                <div className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/20 p-6 space-y-6">
                  <div>
                    <div className="text-[10px] font-black uppercase text-neutral-400 mb-4 flex items-center gap-1 tracking-widest">
                      <Package size={12} /> Items Breakdown
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                            <th className="pb-3">Product</th>
                            <th className="pb-3 text-right">Qty</th>
                            <th className="pb-3 text-right">Rate</th>
                            <th className="pb-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                          {(bill.items_detail || []).map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/40 dark:hover:bg-neutral-800/20 transition-colors">
                              <td className="py-3 font-black text-neutral-800 dark:text-neutral-200 tracking-tight">
                                {item.product_name || `Product #${item.product_id}`}
                              </td>
                              <td className="py-3 text-right font-bold">
                                {item.quantity}
                              </td>
                              <td className="py-3 text-right text-neutral-500 font-medium">
                                ₹{Number(item.price_per_unit).toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 text-right font-black text-neutral-900 dark:text-white tracking-tight">
                                ₹{Number(item.total_price).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {bill.customer_address && (
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <strong className="text-neutral-400 uppercase text-[10px] font-black tracking-widest block mb-2">Shipping Address</strong>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">{bill.customer_address}</p>
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
