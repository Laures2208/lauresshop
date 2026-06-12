import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccountProduct, CartItem, ServicePrices } from '../types';

interface ShopContextType {
  user: User | null;
  login: (username: string, password?: string) => boolean;
  registerUser: (user: Omit<User, 'id' | 'role' | 'balance'>) => void;
  logout: () => void;
  accounts: AccountProduct[];
  addAccount: (acc: Omit<AccountProduct, 'id'>) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  registeredUsers: User[];
  servicePrices: ServicePrices;
  updateServicePrices: (prices: ServicePrices) => void;
  toast: { message: string, type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const INITIAL_ACCOUNTS: AccountProduct[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    title: 'Acc Hayate Tử Thần / Kirito',
    price: 500000,
    originalPrice: 800000,
    discountPercentage: 37,
    rank: 'Cao thủ',
    champions: 112,
    skins: 250,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    title: 'Acc Trắng Thông Tin Siêu Rẻ',
    price: 150000,
    rank: 'Kim cương',
    champions: 80,
    skins: 120,
  },
];

const DEFAULT_PRICES: ServicePrices = {
  rentPerHour: 8000,
  boostBasic: 50000,
  boostStar: 3000,
  boostCombo1: 100000,
  boostCombo2: 50000,
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<AccountProduct[]>(INITIAL_ACCOUNTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [servicePrices, setServicePrices] = useState<ServicePrices>(DEFAULT_PRICES);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedAccounts = localStorage.getItem('accounts');
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));

    const savedPrices = localStorage.getItem('servicePrices');
    if (savedPrices) setServicePrices(JSON.parse(savedPrices));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('servicePrices', JSON.stringify(servicePrices));
  }, [servicePrices]);

  const login = (username: string, password?: string) => {
    if (username === 'Laures2208' && password === 'THPA29122008') {
      setUser({ id: 'admin', username: 'Laures2208', role: 'ADMIN', balance: 0 });
      return true;
    }

    const existingUser = registeredUsers.find(u => u.username === username);
    if (existingUser) {
      setUser(existingUser);
      return true;
    }
    
    return false;
  };

  const registerUser = (userData: Omit<User, 'id' | 'role' | 'balance'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(),
      role: 'USER',
      balance: 0,
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addAccount = (acc: Omit<AccountProduct, 'id'>) => {
    const newAcc: AccountProduct = { ...acc, id: Math.random().toString() };
    setAccounts((prev) => [...prev, newAcc]);
  };

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = { ...item, id: Math.random().toString() };
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateServicePrices = (prices: ServicePrices) => {
    setServicePrices(prices);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ShopContext.Provider value={{
      user, login, registerUser, logout,
      accounts, addAccount,
      cart, addToCart, removeFromCart, clearCart,
      registeredUsers, servicePrices, updateServicePrices,
      toast, showToast
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
