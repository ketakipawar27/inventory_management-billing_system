
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  PlusCircle, 
  Receipt, 
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: { to: string, icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <Link to={to} onClick={onClick} className="group block">
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5' 
        : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
    }`}>
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      {active && <ChevronRight size={14} />}
    </div>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const pageTitle = location.pathname === '/'
    ? 'Overview'
    : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2).replace('/', ' / ');

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300 overflow-x-hidden">

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-neutral-200 dark:border-neutral-900 flex flex-col bg-white dark:bg-black z-50 transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-xl">
                <div className="w-5 h-5 bg-white dark:bg-black rounded-md rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tighter">ZENITH</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-neutral-400 hover:text-black dark:hover:text-white p-2">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-hide">
            <div className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 tracking-widest uppercase mb-4 ml-4">Management</div>
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
            <SidebarItem to="/inventory" icon={Package} label="Inventory" active={location.pathname === '/inventory'} />
            <SidebarItem to="/categories" icon={Tag} label="Categories" active={location.pathname === '/categories'} />
            
            <div className="mt-10 text-[10px] font-black text-neutral-400 dark:text-neutral-600 tracking-widest uppercase mb-4 ml-4">Operations</div>
            <SidebarItem to="/purchases" icon={PlusCircle} label="Purchases" active={location.pathname === '/purchases'} />
            <SidebarItem to="/billing" icon={Receipt} label="Billing" active={location.pathname === '/billing'} />
          </nav>

          <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-900">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-black mb-1">Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Cloud Synced</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 w-full">
        {/* Header */}
        <header className="h-16 lg:h-20 border-b border-neutral-200 dark:border-neutral-900 flex items-center justify-between px-4 lg:px-10 sticky top-0 bg-neutral-50/80 dark:bg-black/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm lg:text-base font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest truncate max-w-[120px] sm:max-w-none">
              {pageTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="w-9 h-9 lg:w-10 lg:h-10 p-0 rounded-full transition-transform active:scale-90"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-neutral-400 hover:text-white" /> : <Moon size={18} className="text-neutral-500 hover:text-black" />}
            </Button>

            <div className="h-6 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 lg:gap-3 px-1">
              <div className="hidden md:block text-right">
                <div className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-tighter">STORE ADMIN</div>
                <div className="text-[10px] text-neutral-400 leading-none">admin@zenith.in</div>
              </div>
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-400 shadow-sm">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-10 w-full">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
