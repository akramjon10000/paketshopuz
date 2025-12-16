import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'Akramjon',
  password: 'Hisobot201415!'
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("Toshkent sh.");

  useEffect(() => {
    // Check Local Storage
    const stored = localStorage.getItem('paketshop_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    // Telegram WebApp Integration
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#f97316');
        tg.setBackgroundColor('#f8fafc');

        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser) {
            const newUser: User = { 
                phone: `TG-${tgUser.id}`, 
                name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
                telegramId: tgUser.id
            };
            setUser(newUser);
            localStorage.setItem('paketshop_user', JSON.stringify(newUser));
        }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Check admin credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = { 
        phone: 'admin', 
        name: 'Admin',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('paketshop_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('paketshop_user');
  };

  const isAdmin = user?.isAdmin === true || user?.name === 'Admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, currentAddress, setCurrentAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};