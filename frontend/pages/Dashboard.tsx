
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Product, Purchase, Bill } from '../types';
import { TrendingUp, Package, CreditCard, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
// Fix: Added missing motion import from framer-motion
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: any) => (
  <Card hoverable className={cn(
    "relative overflow-hidden",
    variant === 'highlight' && "border-black dark:border-white"
  )}>
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white transition-colors">
        <Icon size={22} />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg",
          trend > 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
        )}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-neutral-500 dark:text-neutral-400 text-xs font-black uppercase tracking-widest">{title}</h3>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <p className="text-xs text-neutral-400 font-medium">{subtitle}</p>
    </div>
  </Card>
);

const Dashboard = () => {
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

  // Use unit_price instead of price for inventory value
  const totalInventoryValue = data.products.reduce((acc, p) => acc + ((p.unit_price || 0) * (p.stock_quantity || 0)), 0);
  const totalRevenue = data.bills.reduce((acc, b) => acc + b.total_amount, 0);
  const totalExpenses = data.purchases.reduce((acc, p) => acc + p.total_amount, 0);
  const lowStockCount = data.products.filter(p => p.stock_quantity < 10).length;

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-neutral-200 dark:bg-neutral-900 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-neutral-200 dark:bg-neutral-900 rounded-2xl" />
        <div className="h-96 bg-neutral-200 dark:bg-neutral-900 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Summary</h2>
          <p className="text-neutral-500 font-medium">Insights and growth tracking for your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">New Sale</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Inventory Value" 
          value={formatCurrency(totalInventoryValue)} 
          subtitle="Total stock valuation"
          icon={Package} 
          trend={+4.1}
        />
        <StatCard 
          title="Net Revenue" 
          value={formatCurrency(totalRevenue)} 
          subtitle="Total billing to date"
          icon={TrendingUp} 
          trend={+18.2}
          variant="highlight"
        />
        <StatCard 
          title="Procurement Cost" 
          value={formatCurrency(totalExpenses)} 
          subtitle="Investment in stock"
          icon={CreditCard} 
          trend={-2.4}
        />
        <StatCard 
          title="Critical Alerts" 
          value={lowStockCount} 
          subtitle="Items needing refill"
          icon={Package} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black tracking-tight">Recent Activity</h2>
              <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} className="flex-row-reverse">
                View Ledger
              </Button>
            </div>
            <div className="space-y-2">
              {[...data.bills, ...data.purchases]
                .sort((a: any, b: any) => new Date(b.bill_date || b.purchase_date).getTime() - new Date(a.bill_date || a.purchase_date).getTime())
                .slice(0, 6)
                .map((item: any, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900/80 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        item.bill_date ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}>
                        {item.bill_date ? <TrendingUp size={18} /> : <CreditCard size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm tracking-tight">{item.bill_date ? `Sale #${item.id}` : `Restock #${item.id}`}</div>
                        <div className="text-[11px] text-neutral-400 font-black uppercase tracking-wider">
                          {new Date(item.bill_date || item.purchase_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "text-sm font-black tracking-tight",
                      item.bill_date ? "text-neutral-900 dark:text-white" : "text-neutral-400"
                    )}>
                      {item.bill_date ? '+' : '-'}{formatCurrency(item.total_amount)}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <h2 className="text-xl font-black tracking-tight mb-8">Top Products</h2>
            <div className="space-y-8">
              {data.products
                .sort((a, b) => b.stock_quantity - a.stock_quantity)
                .slice(0, 5)
                .map((p, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold truncate max-w-[150px]">{p.name}</div>
                      <div className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{p.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black">{p.stock_quantity} <span className="text-[10px] text-neutral-400">UNITS</span></div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((p.stock_quantity / 100) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className={cn(
                        "h-full rounded-full",
                        p.stock_quantity < 10 ? "bg-rose-500" : "bg-black dark:bg-white"
                      )}
                    />
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
