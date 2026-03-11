import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Check } from 'lucide-react';
import { useAuth, User } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { setSession } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'swami@gmail.com' && password === '@Swami1234') {
        const data = { email, name: 'Swami' };
        setUserData(data);
        setIsSuccess(true);
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred during login.');
      setLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    if (isSuccess && userData) {
      setSession(userData);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-red-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-neutral-900/50 rounded-full blur-[150px]"
        />
      </div>

      {/* Success Transition Overlay */}
      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            onAnimationComplete={handleAnimationComplete}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Check className="w-16 h-16 text-black" strokeWidth={4} />
                </motion.div>
              </div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-3xl font-black uppercase tracking-tighter text-white"
              >
                Welcome back, {userData?.name}
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isSuccess ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          {/* Subtle glow effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors duration-700" />

          <div className="flex flex-col items-center mb-10">
            <motion.div
              layoutId="logo"
              className="w-24 h-24 mb-6 relative rounded-full overflow-hidden border-2 border-red-600/30 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <img
                src="/static/swami_logo.jpg"
                alt="Swami Symbol"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2 text-white">Swami Inventory</h1>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em]">Business Operations Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-600 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-white placeholder:text-neutral-700"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-600 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-white placeholder:text-neutral-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs h-auto mt-6 group relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all"
              disabled={loading || isSuccess}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="label"
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Enter System
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
