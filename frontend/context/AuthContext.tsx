import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLocked: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  setSession: (user: User) => void;
  logout: () => void;
  lock: () => void;
  unlock: (password: string) => Promise<boolean>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem('isLocked') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setSession = useCallback((userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Hardcoded credentials
    if (email === 'swami@gmail.com' && password === '@Swami1234') {
      const userData = { email, name: 'Swami' };
      setSession(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLocked(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isLocked');
    localStorage.removeItem('user');
  };

  const lock = useCallback(() => {
    setIsLocked(true);
    localStorage.setItem('isLocked', 'true');
  }, []);

  const unlock = async (password: string): Promise<boolean> => {
    if (password === '@Swami1234') {
      setIsLocked(false);
      localStorage.setItem('isLocked', 'false');
      return true;
    }
    return false;
  };

  // Auto-lock logic
  useEffect(() => {
    if (!isAuthenticated || isLocked) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(lock, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, isLocked, lock]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLocked, login, setSession, logout, lock, unlock, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
