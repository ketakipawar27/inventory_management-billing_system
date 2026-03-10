import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api';
import { Purchase, Bill } from '../types';
import { Search, Filter, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Clock, Calendar, ChevronRight, Package, ArrowLeft, User } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';

const ActivityHistory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<{ purchases: Purchase[], bills: Bill[] }>({ purchases: [], bills: [] });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sale" | "restock">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pur, b] = await Promise.all([
          api.purchases.list(),
          api.bills.list()
        ]);
        setData({ purchases: pur, bills: b });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activities = useMemo(() => {
    const combined = [
      ...data.bills.map(b => ({ ...b, activityType: 'sale' as const, date: b.bill_date })),
      ...data.purchases.map(p => ({ ...p, activityType: 'restock' as const, date: p.purchase_date }))
    ].sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

    return combined.filter(item => {
      const idStr = String(item.id || "");
      const matchesSearch = idStr.includes(search) ||
                           (item.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
                           (item.dealer_name || "").toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || item.activityType === typeFilter;

      const isPending = item.payment_method === 'pending';
      const matchesStatus = statusFilter === "all" ||
                           (statusFilter === "pending" && isPending) ||
                           (statusFilter === "completed" && !isPending);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, search, typeFilter, statusFilter]);

  if (loading) return (
    <div className="space-y-4 animate-pulse p-4">
      <div className="h-10 w-48 bg-neutral-100 dark:bg-neutral-900 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map(i => <div key={i} className="h-10 bg-neutral-100 dark:bg-neutral-900 rounded-xl" />)}
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-5 pb-10 max-w-5xl mx-auto p-4 sm:p-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="h-9 w-9 p-0 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
           <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title="Activity History"
          description="A complete record of all sales and restock transactions."
          className="flex-1"
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-white dark:bg-neutral-900 p-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-visible">
        <div className="flex-1 min-w-0 relative">
          <Input
            placeholder="Search ID, Customer or Dealer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} className="text-neutral-400" />}
            className="h-10 text-xs bg-neutral-50/50 dark:bg-black/30 border-transparent rounded-xl px-4 pl-10"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-visible">
           <div className="w-1/2 md:w-[140px]">
             <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                placeholder="Type"
                icon={<Filter size={14} />}
                className="h-10 text-[11px] font-bold uppercase tracking-tight rounded-xl px-3 bg-neutral-50/50 dark:bg-black/30 border-transparent"
                options={[
                  { value: "all", label: "All Types" },
                  { value: "sale", label: "Sales Only" },
                  { value: "restock", label: "Restocks" }
                ]}
             />
           </div>
           <div className="w-1/2 md:w-[140px]">
             <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                placeholder="Status"
                icon={<Clock size={14} />}
                className="h-10 text-[11px] font-bold uppercase tracking-tight rounded-xl px-3 bg-neutral-50/50 dark:bg-black/30 border-transparent"
                options={[
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending" },
                  { value: "completed", label: "Completed" }
                ]}
             />
           </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-2.5">
        {activities.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] italic border-2 border-dashed border-neutral-100 dark:border-neutral-900 rounded-2xl bg-neutral-50/30">
            No activities matching your filters
          </div>
        ) : (
          activities.map((item: any) => (
            <div
              key={`${item.activityType}-${item.id}`}
              className="group flex items-center justify-between px-4 py-3.5 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl hover:border-black dark:hover:border-white transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  item.activityType === 'sale'
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                )}>
                  {item.activityType === 'sale' ? <TrendingUp size={18} /> : <CreditCard size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-[13px] text-neutral-900 dark:text-white tracking-tight leading-none uppercase">
                      {item.activityType === 'sale' ? `Sale #${item.id}` : `Restock #${item.id}`}
                    </span>
                    {item.payment_method === 'pending' && (
                       <Badge variant="error" className="text-[7px] px-1.5 py-0 font-black tracking-widest bg-amber-100/50 text-amber-600 border-none">PENDING</Badge>
                    )}
                  </div>
                  <div className="text-[9px] text-neutral-400 font-bold flex items-center gap-3 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1 leading-none">
                       {item.activityType === 'sale' ? (
                          <><User size={10} /> {item.customer_name || "Guest"}</>
                       ) : (
                          <><Package size={10} /> {item.dealer_name || "Supplier"}</>
                       )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="text-right shrink-0">
                    <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1 leading-none">Amount</div>
                    <div className={cn(
                      "text-sm font-black tracking-tight leading-none",
                      item.activityType === 'sale' ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
                    )}>
                      {item.activityType === 'sale' ? '+' : '-'}{formatCurrency(item.total_amount)}
                    </div>
                 </div>
                 <ChevronRight size={16} className="text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;
