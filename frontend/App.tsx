import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import Purchases from './pages/Purchases';
import Billing from './pages/Billing';
import ActivityHistory from './pages/ActivityHistory';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/activity" element={<ActivityHistory />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
