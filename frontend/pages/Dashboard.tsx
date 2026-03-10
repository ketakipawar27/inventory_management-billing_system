import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Product, Purchase, Bill } from '../types';
import { TrendingUp, Package, CreditCard, ArrowUpRight, ArrowDownRight, ArrowRight, DollarSign, Activity, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default', footer }: any) => (
  <Card hoverable className={cn(
    "relative overflow-hidden p-3.5 sm:p-4 flex flex-col justify-between h-full min-h-[120px] sm:min-h-[130px]",
    variant === 'highlight' && "bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10"
  )}>
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
          <Icon size={16} />
        </div>
        {trend !== undefined && (
          <Badge variant={trend > 0 ? "success" : "error"} className="px-1 py-0 text-[8px] sm:text-[9px]">
            {trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(trend)}%
          </Badge>
        )}
      </div>
      <div>
        <h3 className="text-neutral-500 dark:text-neutral-400 text-[9px] font-black uppercase tracking-wider mb-0.5">{title}</h3>
        <div className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 dark:text-white truncate">{value}</div>
        <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium truncate">{subtitle}</p>
      </div>
    </div>
    {footer && (
      <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
        {footer}
      </div>
    )}
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<{ products: Product[], purchases: Purchase[], bills: Bill[] }>({ products: [], purchases: [], bills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, pur, b] = await Promise.all([
          api.products.list(),
          api.purchases.list(),
          api.bills.list()
        ]);
        setData({ products: p, purchases: pur, bills: b });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 1. Inventory Value = sum(remaining_stock * purchase_price)
  const totalInventoryValue = data.products.reduce((acc, p) => acc + (Number(p.purchase_price || 0) * (p.stock_quantity || 0)), 0);
  const totalStockUnits = data.products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);

  // 2. Revenue Calculations
  const totalRevenue = data.bills.reduce((acc, b) => acc + (Number(b.total_amount) || 0), 0);
  const pendingRevenue = data.bills
    .filter(b => b.payment_method === 'pending')
    .reduce((acc, b) => acc + (Number(b.total_amount) || 0), 0);
  const collectedRevenue = totalRevenue - pendingRevenue;
  const pendingBillsCount = data.bills.filter(b => b.payment_method === 'pending').length;

  // 3. Profit Calculations
  let totalPotentialProfit = 0;
  let realizedProfit = 0;

  data.bills.forEach(bill => {
    const billProfit = (bill.items_detail || []).reduce((sum, item) => {
      return sum + (Number(item.quantity) * (Number(item.price_per_unit) - Number(item.purchase_price || 0)));
    }, 0);

    totalPotentialProfit += billProfit;
    if (bill.payment_method !== 'pending') {
      realizedProfit += billProfit;
    }
  });

  const lowStockCount = data.products.filter(p => p.stock_quantity <= p.min_stock).length;

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
        <div className="h-64 bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <PageHeader
        description="Insights and growth tracking for your store."
        className="mb-4"
        action={
          <div className="flex items-center gap-2">
            {lowStockCount > 0 && (
              <Badge variant="error" className="h-8 px-2 flex gap-1.5 items-center animate-pulse">
                <AlertTriangle size={12} />
                <span className="text-[10px]">{lowStockCount} Alert</span>
              </Badge>
            )}
            <Button variant="outline" size="sm" className="h-8 text-[11px] px-3">Export</Button>
            <Button size="sm" className="h-8 text-[11px] px-3" onClick={() => navigate('/billing')}>New Sale</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard 
          title="Inventory Value" 
          value={formatCurrency(totalInventoryValue)} 
          subtitle="At purchase cost"
          icon={Package} 
          footer={
            <div className="flex justify-between items-center text-[8px] font-black tracking-widest">
              <span className="text-neutral-400">UNITS:</span>
              <span className="text-neutral-600 dark:text-neutral-300">{totalStockUnits.toLocaleString()} QTY</span>
            </div>
          }
        />
        <StatCard 
          title="Net Revenue" 
          value={formatCurrency(totalRevenue)} 
          subtitle="Total sales value"
          icon={TrendingUp} 
          variant="highlight"
          footer={
            <div className="flex justify-between items-center text-[8px] font-black tracking-widest">
              <span className="text-neutral-400">COLLECTED:</span>
              <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(collectedRevenue)}</span>
            </div>
          }
        />
        <StatCard 
          title="Total Profit"
          value={formatCurrency(realizedProfit)}
          subtitle="Actual cash profit"
          icon={DollarSign}
          footer={
            <div className="flex justify-between items-center text-[8px] font-black tracking-widest">
              <span className="text-neutral-400">POTENTIAL:</span>
              <span className="text-neutral-500">{formatCurrency(totalPotentialProfit)}</span>
            </div>
          }
        />
        <StatCard 
          title="Receivables"
          value={formatCurrency(pendingRevenue)}
          subtitle="Owed by customers"
          icon={Clock}
          variant={pendingRevenue > 0 ? 'default' : 'default'}
          footer={
            <div className="flex justify-between items-center text-[8px] font-black tracking-widest">
              <span className="text-neutral-400">PENDING:</span>
              <span className="text-amber-600 dark:text-amber-400">{pendingBillsCount} BILLS</span>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="order-1 lg:order-2">
          <Card className="p-0 overflow-hidden border-neutral-200/60 dark:border-neutral-800/60 shadow-sm bg-white dark:bg-neutral-900">
            <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/50 flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <Package size={14} />
              <h2 className="text-[10px] font-black uppercase tracking-wider">Stock Status</h2>
            </div>
            <div className="p-4 space-y-4">
              {data.products
                .sort((a, b) => a.stock_quantity - b.stock_quantity)
                .slice(0, 6)
                .map((p, idx) => {
                  const isLow = p.stock_quantity <= p.min_stock;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <div className="min-w-0 flex-1">
                          <div className={cn(
                            "text-xs font-bold truncate",
                            isLow ? "text-rose-600 dark:text-rose-400" : "text-neutral-800 dark:text-neutral-200"
                          )}>{p.name}</div>
                          <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-tight">{p.variant || 'Standard'}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={cn(
                            "text-[10px] font-black",
                            isLow ? "text-rose-500" : "text-neutral-700 dark:text-neutral-300"
                          )}>
                            {p.stock_quantity} <span className="opacity-50 text-[8px]">QTY</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((p.stock_quantity / Math.max(p.min_stock * 2, 10)) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "circOut" }}
                          className={cn(
                            "h-full rounded-full",
                            isLow ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : p.stock_quantity <= p.min_stock * 2 ? "bg-amber-500" : "bg-neutral-900 dark:bg-neutral-200"
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="p-0 overflow-hidden border-neutral-200/60 dark:border-neutral-800/60 shadow-sm bg-white dark:bg-neutral-900">
            <div className="px-4 py-3 flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800/50">
              <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                <Activity size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-wider">Recent Activity</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/activity')}
                className="h-6 text-[9px] font-black text-neutral-400 hover:text-black dark:hover:text-white uppercase tracking-widest"
              >
                View All <ArrowRight size={10} className="ml-1" />
              </Button>
            </div>
            <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
              {[...data.bills, ...data.purchases]
                .sort((a: any, b: any) => new Date(b.bill_date || b.purchase_date).getTime() - new Date(a.bill_date || a.purchase_date).getTime())
                .slice(0, 4)
                .map((item: any, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        item.bill_date ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                      )}>
                        {item.bill_date ? <TrendingUp size={14} /> : <CreditCard size={14} />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-neutral-800 dark:text-neutral-200 truncate">{item.bill_date ? `Sale #${item.id}` : `Restock #${item.id}`}</div>
                        <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-tight">
                          {new Date(item.bill_date || item.purchase_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "text-xs font-black tracking-tight flex flex-col items-end",
                      item.bill_date ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
                    )}>
                      <span>{item.bill_date ? '+' : '-'}{formatCurrency(item.total_amount)}</span>
                      {item.payment_method === 'pending' && <span className="text-[8px] text-amber-500 font-black uppercase">Pending</span>}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
