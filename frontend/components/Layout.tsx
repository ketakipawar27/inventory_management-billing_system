
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
  X,
  Lock,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const SidebarItem = ({ to, icon: Icon, label, active, onClick, className }: { to?: string, icon: any, label: string, active?: boolean, onClick?: () => void, className?: string }) => {
  const content = (
    <div className={cn(
      "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
      active 
        ? "bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5"
        : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900",
      className
    )}>
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {active && <ChevronRight size={14} />}
    </div>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="group block">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className="group block">
      {content}
    </div>
  );
};

const BottomNavItem = ({ to, icon: Icon, label, active, onClick }: { to?: string, icon: any, label: string, active?: boolean, onClick?: () => void }) => {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center flex-1 gap-1 py-2 transition-all active:scale-95 cursor-pointer",
      active ? "text-black dark:text-white" : "text-neutral-400 dark:text-neutral-500"
    )}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className={cn(
        "text-[9px] font-black uppercase tracking-widest",
        active ? "opacity-100" : "opacity-60"
      )}>
        {label}
      </span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="flex-1">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className="flex-1">
      {content}
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { lock, logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const pageTitle = location.pathname === '/'
    ? 'Dashboard'
    : location.pathname.slice(1).split('/')[0].toUpperCase();

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300 overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 border-r border-neutral-200 dark:border-neutral-900 flex flex-col bg-white dark:bg-black z-50 transition-transform duration-300 lg:translate-x-0 hidden lg:flex"
      )}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-xl">
                <div className="w-5 h-5 bg-white dark:bg-black rounded-md rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">Swami</span>
            </div>
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

          <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-900 space-y-1">
            <div className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 tracking-widest uppercase mb-4 ml-4">System</div>
            <SidebarItem icon={Lock} label="Lock System" onClick={lock} />
            <SidebarItem icon={LogOut} label="Sign Out" onClick={logout} className="hover:text-red-500 dark:hover:text-red-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        <header className="h-16 lg:h-20 border-b border-neutral-200 dark:border-neutral-900 flex items-center justify-between px-4 lg:px-10 bg-neutral-50/80 dark:bg-black/80 backdrop-blur-xl z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white dark:bg-black rounded-sm rotate-45" />
            </div>
            <h1 className="text-sm lg:text-base font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-[0.2em] truncate max-w-[150px] sm:max-w-none">
              {pageTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="w-10 h-10 p-0 rounded-full transition-transform active:scale-90"
              aria-label="Toggle Theme"
              icon={theme === 'dark' ? <Sun size={18} className="text-neutral-400 hover:text-white" /> : <Moon size={18} className="text-neutral-500 hover:text-black" />}
            />

            <div className="h-6 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 lg:gap-3 px-1">
              <div className="hidden md:block text-right">
                <div className="text-[10px] font-black text-neutral-900 dark:text-white uppercase tracking-widest">{user?.name || 'Admin'} Panel</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-tight">{user?.email || 'admin@swami.in'}</div>
              </div>
              <div
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-black text-neutral-600 dark:text-neutral-400 shadow-sm text-sm cursor-pointer lg:cursor-default"
              >
                {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Side Menu (Overlay) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-[280px] bg-white dark:bg-black z-[70] lg:hidden p-6 flex flex-col border-l border-neutral-200 dark:border-neutral-900"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="text-xs font-black uppercase tracking-widest text-neutral-400">Account</div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-10 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center font-black text-white dark:text-black">
                    {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase">{user?.name || 'Admin'}</div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase truncate max-w-[140px]">{user?.email || 'admin@swami.in'}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 tracking-widest uppercase mb-4 ml-4">System Actions</div>
                  <SidebarItem icon={Lock} label="Lock System" onClick={() => { lock(); setIsSidebarOpen(false); }} />
                  <SidebarItem icon={LogOut} label="Sign Out" onClick={() => { logout(); setIsSidebarOpen(false); }} className="text-red-500" />
                </div>

                <div className="mt-auto">
                   <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">System Online</span>
                   </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
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

        {/* Simple Bottom Navigation (Mobile Only) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around px-2 z-40 pb-safe">
           <BottomNavItem to="/" icon={LayoutDashboard} label="Home" active={location.pathname === '/'} />
           <BottomNavItem to="/inventory" icon={Package} label="Stock" active={location.pathname === '/inventory'} />

           {/* Center Billing Button - Highlighted Simple Style */}
           <Link to="/billing" className="flex flex-col items-center justify-center flex-1 gap-1 py-2 group">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90",
                location.pathname === '/billing'
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
              )}>
                <Receipt size={22} strokeWidth={2.5} />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest transition-all",
                location.pathname === '/billing' ? "text-black dark:text-white" : "text-neutral-400 dark:text-neutral-500 opacity-60"
              )}>
                Billing
              </span>
           </Link>

           <BottomNavItem to="/purchases" icon={PlusCircle} label="Buy" active={location.pathname === '/purchases'} />
           <BottomNavItem to="/categories" icon={Tag} label="Tags" active={location.pathname === '/categories'} />
        </nav>
      </div>
    </div>
  );
};

export default Layout;
