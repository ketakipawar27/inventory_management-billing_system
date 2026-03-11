import React, { useState } from 'react';
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
      filter: 'blur(20px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Background Image - Updated as per request */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/static/swami_samarth_wallpaper.jpg"
          alt="Swami Samarth"
          className="w-full h-full object-cover"
          onError={(e) => {
             // If wallpaper is missing, the screen stays dark/black
             (e.target as HTMLImageElement).style.opacity = '0';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isUnlocking ? "exit" : "visible"}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-center">

          <motion.div variants={itemVariants} className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-neutral-800/50 border-2 border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
               <img
                 src="/static/swami_logo.jpg"
                 alt="Swami Logo"
                 className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
               />
               <motion.div
                 className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
               />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-neutral-900 z-10"
            >
              <Lock size={14} className="text-black" />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-1 text-white">{user?.name || 'Swami'}</h2>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-8">{user?.email || 'swami@gmail.com'}</p>
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
                className="block w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-white focus:border-transparent transition-all outline-none text-center text-white placeholder:text-neutral-600"
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
              className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs h-auto group overflow-hidden relative hover:bg-neutral-200 transition-colors shadow-lg"
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
            className="mt-8 flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mx-auto text-[10px] font-black uppercase tracking-widest"
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
