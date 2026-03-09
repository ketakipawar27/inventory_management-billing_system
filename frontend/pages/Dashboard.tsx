import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Product, Purchase, Bill } from '../types';
import { TrendingUp, Package, CreditCard, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: any) => (
  <Card hoverable className={cn(
    "relative overflow-hidden p-5 sm:p-6",
    variant === 'highlight' && "border-black dark:border-white ring-1 ring-black/5 dark:ring-white/5"
  )}>
    <div className="flex justify-between items-start mb-4 sm:mb-6">
      <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white transition-colors">
        <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
      </div>
      {trend && (
        <Badge variant={trend > 0 ? "success" : "error"} className="px-2 py-1">
          {trend > 0 ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
          {Math.abs(trend)}%
        </Badge>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-neutral-500 dark:text-neutral-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">{title}</h3>
      <div className="text-2xl sm:text-3xl font-black tracking-tighter truncate">{value}</div>
      <p className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate">{subtitle}</p>
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

  const totalInventoryValue = data.products.reduce((acc, p) => acc + ((p.unit_price || 0) * (p.stock_quantity || 0)), 0);
  const totalRevenue = data.bills.reduce((acc, b) => acc + (Number(b.total_amount) || 0), 0);
  const totalExpenses = data.purchases.reduce((acc, p) => acc + (Number(p.total_amount) || 0), 0);
  const lowStockCount = data.products.filter(p => p.stock_quantity < 5).length;

  if (loading) return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-40 sm:h-44 bg-neutral-200 dark:bg-neutral-900 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 h-80 sm:h-96 bg-neutral-200 dark:bg-neutral-900 rounded-2xl" />
        <div className="h-80 sm:h-96 bg-neutral-200 dark:bg-neutral-900 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 sm:space-y-10 pb-10">
      <PageHeader
        description="Insights and growth tracking for your store."
        action={
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none py-2 text-xs">Export Report</Button>
            <Button size="sm" className="flex-1 sm:flex-none py-2 text-xs">New Sale</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="h-full p-5 sm:p-8">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-black tracking-tight">Recent Activity</h2>
              <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} className="flex-row-reverse text-xs">
                View Ledger
              </Button>
            </div>
            <div className="space-y-1 sm:space-y-2">
              {[...data.bills, ...data.purchases]
                .sort((a: any, b: any) => new Date(b.bill_date || b.purchase_date).getTime() - new Date(a.bill_date || a.purchase_date).getTime())
                .slice(0, 6)
                .map((item: any, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 sm:p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900/80 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={cn(
                        "w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        item.bill_date ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}>
                        {item.bill_date ? <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px]" /> : <CreditCard size={16} className="sm:w-[18px] sm:h-[18px]" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm tracking-tight">{item.bill_date ? `Sale #${item.id}` : `Restock #${item.id}`}</div>
                        <div className="text-[9px] sm:text-[11px] text-neutral-400 font-black uppercase tracking-wider">
                          {new Date(item.bill_date || item.purchase_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "text-xs sm:text-sm font-black tracking-tight",
                      item.bill_date ? "text-neutral-900 dark:text-white" : "text-neutral-400"
                    )}>
                      {item.bill_date ? '+' : '-'}{formatCurrency(item.total_amount)}
                    </div>
                  </div>
                ))}
              {data.bills.length === 0 && data.purchases.length === 0 && (
                <div className="py-10 text-center text-neutral-400 text-sm italic">No recent activity</div>
              )}
            </div>
          </Card>
        </div>

        <div className="order-1 lg:order-2">
          <Card className="h-full p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-black tracking-tight mb-6 sm:mb-8">Inventory Status</h2>
            <div className="space-y-6 sm:space-y-8">
              {data.products
                .sort((a, b) => b.stock_quantity - a.stock_quantity)
                .slice(0, 5)
                .map((p, idx) => (
                <div key={idx} className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-bold truncate pr-2">{p.name}</div>
                      <div className="text-[9px] sm:text-[10px] text-neutral-400 font-black uppercase tracking-widest">{p.variant || 'Standard'}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] sm:text-xs font-black">{p.stock_quantity} <span className="text-[8px] sm:text-[10px] text-neutral-400">UNITS</span></div>
                    </div>
                  </div>
                  <div className="h-1.5 sm:h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((p.stock_quantity / 100) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className={cn(
                        "h-full rounded-full transition-colors",
                        p.stock_quantity < 5 ? "bg-rose-500" : p.stock_quantity < 20 ? "bg-amber-500" : "bg-black dark:bg-white"
                      )}
                    />
                  </div>
                </div>
              ))}
              {data.products.length === 0 && (
                <div className="py-10 text-center text-neutral-400 text-sm italic">No products in inventory</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
