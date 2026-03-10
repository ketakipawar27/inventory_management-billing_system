import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

const LockScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { unlock, user, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await unlock(password);
      if (success) {
        setIsUnlocking(true);
      } else {
        setError('Invalid password');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isUnlocking ? "exit" : "visible"}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/10 backdrop-blur-2xl text-center">

          <motion.div variants={itemVariants} className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-black text-neutral-600 dark:text-neutral-400 text-3xl shadow-inner relative overflow-hidden group">
               {user?.name?.substring(0, 2).toUpperCase() || 'SW'}
               <motion.div
                 className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
               />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-neutral-900"
            >
              <Lock size={16} className="text-white dark:text-black" />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-1 dark:text-white">{user?.name || 'Swami'}</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-8">{user?.email || 'swami@gmail.com'}</p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative group">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="block w-full px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none text-center dark:text-white"
                placeholder="Enter password to unlock"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-[10px] font-black uppercase tracking-widest"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs h-auto group overflow-hidden relative"
              disabled={loading}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    Unlock
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.form>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="mt-8 flex items-center gap-2 text-neutral-400 hover:text-red-500 transition-colors mx-auto text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={14} />
            Switch Account
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LockScreen;
