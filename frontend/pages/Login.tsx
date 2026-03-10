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
        // We wait for the animation to complete before calling setSession
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
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          animate={isSuccess ? { scale: 1.5, opacity: 0.8 } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-neutral-200 dark:bg-neutral-900 rounded-full blur-[120px] opacity-50"
        />
        <motion.div
          animate={isSuccess ? { scale: 1.5, opacity: 0.8 } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-neutral-200 dark:bg-neutral-900 rounded-full blur-[120px] opacity-50"
        />
      </div>

      {/* Success Transition Overlay */}
      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black"
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
              <div className="w-24 h-24 bg-black dark:bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Check className="w-12 h-12 text-white dark:text-black" strokeWidth={3} />
                </motion.div>
              </div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl font-black uppercase tracking-tighter"
              >
                Welcome back, {userData?.name}
              </motion.h2>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-neutral-500 mt-2"
              >
                Preparing your dashboard...
              </motion.p>
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
        <div className="bg-white dark:bg-neutral-900/50 backdrop-blur-2xl border border-neutral-200 dark:border-neutral-800 p-8 rounded-[2rem] shadow-2xl shadow-black/5">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              layoutId="logo"
              className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-6"
            >
              <div className="w-8 h-8 bg-white dark:bg-black rounded-lg rotate-45" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Welcome Back</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium tracking-tight">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold p-4 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs h-auto mt-4 group relative overflow-hidden"
              disabled={loading || isSuccess}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Check className="w-5 h-5 mx-auto" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="label"
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign In
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
