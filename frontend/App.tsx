import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import Purchases from './pages/Purchases';
import Billing from './pages/Billing';
import ActivityHistory from './pages/ActivityHistory';
import Login from './pages/Login';
import LockScreen from './pages/LockScreen';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLocked } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          <Login />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="min-h-screen relative overflow-hidden"
        >
          <AnimatePresence>
            {isLocked && (
              <motion.div
                key="lock-screen-wrapper"
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(0px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[100]"
              >
                <LockScreen />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            animate={{
              filter: isLocked ? 'blur(12px) brightness(0.7)' : 'blur(0px) brightness(1)',
              scale: isLocked ? 0.96 : 1,
              opacity: isLocked ? 0.4 : 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              filter: { duration: 0.8 },
              scale: { duration: 0.8 },
              opacity: { duration: 0.8 }
            }}
            className="pointer-events-auto min-h-screen"
            style={{ pointerEvents: isLocked ? 'none' : 'auto' }}
          >
            <HashRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/purchases" element={<Purchases />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/activity" element={<ActivityHistory />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </HashRouter>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
