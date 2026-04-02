import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { ADMIN_TOKEN_STORAGE_KEY, authAPI } from '../utils/api';

interface AuthContextType {
  user: User | null;
  register: (name: string, phone: string) => void;
  loginAdmin: (password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
}

const USER_STORAGE_KEY = 'paketshop_user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('Toshkent sh.');

  useEffect(() => {
    const hydrateUser = async () => {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      const adminToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

      if (stored) {
        const parsedUser = JSON.parse(stored) as User;

        if (parsedUser.isAdmin) {
          if (!adminToken) {
            localStorage.removeItem(USER_STORAGE_KEY);
          } else {
            try {
              const session = await authAPI.validateAdminSession();
              const adminUser: User = {
                phone: 'admin',
                name: session.user.name,
                isAdmin: true,
              };
              setUser(adminUser);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
            } catch {
              localStorage.removeItem(USER_STORAGE_KEY);
              localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
            }
          }
        } else {
          setUser(parsedUser);
        }
      }

      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#f97316');
        tg.setBackgroundColor('#f8fafc');

        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser && !localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)) {
          const telegramUser: User = {
            phone: `TG-${tgUser.id}`,
            name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
            telegramId: tgUser.id,
          };
          setUser(telegramUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(telegramUser));
        }
      }
    };

    void hydrateUser();
  }, []);

  const register = (name: string, phone: string) => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);

    const newUser: User = {
      phone,
      name,
      isAdmin: false,
    };
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  };

  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const result = await authAPI.loginAdmin(password);
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, result.token);

      const adminUser: User = {
        phone: 'admin',
        name: result.user.name,
        isAdmin: true,
      };

      setUser(adminUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  };

  const isAdmin = user?.isAdmin === true;

  return (
    <AuthContext.Provider value={{ user, register, loginAdmin, logout, isAdmin, currentAddress, setCurrentAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
