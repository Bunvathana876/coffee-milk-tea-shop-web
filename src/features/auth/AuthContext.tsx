import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type CustomerUser,
  loginCustomer,
  registerCustomer,
  getCustomerProfile,
} from '../../services/api';

const TOKEN_KEY = 'coffee_customer_token';
const USER_KEY = 'coffee_customer_user';

export interface AuthModalOptions {
  mode?: 'login' | 'register';
  redirectTo?: string;
}

interface AuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalOptions: AuthModalOptions;
  openAuthModal: () => void;
  /** Open the modal in a specific mode and optionally navigate somewhere after success. */
  openAuthModalWith: (options: AuthModalOptions) => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<void>;
  register: (fullName: string, phone: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const [user, setUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [authModalOptions, setAuthModalOptions] = useState<AuthModalOptions>({});

  const openAuthModal = () => {
    setAuthModalOptions({});
    setAuthModalOpen(true);
  };
  const openAuthModalWith = (options: AuthModalOptions) => {
    setAuthModalOptions(options);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await getCustomerProfile(token);
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    } catch {
      // If token expired, clear auth
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    getCustomerProfile(token)
      .then((profile) => {
        if (!cancelled) {
          setUser(profile);
          localStorage.setItem(USER_KEY, JSON.stringify(profile));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginCustomer({ identifier, password });
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, phone: string, password: string, email?: string) => {
    setIsLoading(true);
    try {
      const res = await registerCustomer({
        full_name: fullName,
        phone,
        email: email || undefined,
        password,
      });
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        authModalOpen,
        authModalOptions,
        openAuthModal,
        openAuthModalWith,
        closeAuthModal,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

