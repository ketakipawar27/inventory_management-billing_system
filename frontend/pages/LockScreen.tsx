import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

const LockScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { unlock, user, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await unlock(password);
      if (!success) {
        setError('Invalid password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/10 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-black text-neutral-600 dark:text-neutral-400 text-3xl shadow-inner">
              {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-neutral-900">
              <Lock size={16} className="text-white dark:text-black" />
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tighter uppercase mb-1">{user?.name || 'Session Locked'}</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-8">{user?.email || 'admin@swami.in'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="block w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none text-center"
                placeholder="Enter password to unlock"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs h-auto group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Unlock
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <button
            onClick={logout}
            className="mt-8 flex items-center gap-2 text-neutral-400 hover:text-red-500 transition-colors mx-auto text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={14} />
            Switch Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LockScreen;
