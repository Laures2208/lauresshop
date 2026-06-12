import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccountProduct, CartItem, ServicePrices } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, setDoc, doc, addDoc } from 'firebase/firestore';

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
    gameUsername: 'kirito_pro',
    gamePassword: 'password123',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    title: 'Acc Trắng Thông Tin Siêu Rẻ',
    price: 150000,
    rank: 'Kim cương',
    champions: 80,
    skins: 120,
    gameUsername: 'smurf_acc',
    gamePassword: 'password123',
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

  useEffect(() => {
    // Load local auth & cart
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // Firebase realtime subscriptions
    const unsubPrices = onSnapshot(doc(db, 'settings', 'prices'), (docSnap) => {
      if (docSnap.exists()) {
        setServicePrices(docSnap.data() as ServicePrices);
      } else {
        setDoc(doc(db, 'settings', 'prices'), DEFAULT_PRICES).catch(console.error);
      }
    }, (error) => {
      console.error('Firestore Error prices:', error);
    });

    const unsubAccounts = onSnapshot(collection(db, 'accounts'), (snapshot) => {
      const accs = snapshot.docs.map(accDoc => ({ id: accDoc.id, ...accDoc.data() } as AccountProduct));
      if (accs.length > 0) {
        setAccounts(accs);
      } else {
        // Seed initial accounts if empty
        INITIAL_ACCOUNTS.forEach(acc => {
          setDoc(doc(db, 'accounts', acc.id), acc).catch(console.error);
        });
        setAccounts(INITIAL_ACCOUNTS);
      }
    }, (error) => {
      console.error('Firestore Error accounts:', error);
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(userDoc => ({ id: userDoc.id, ...userDoc.data() } as User));
      setRegisteredUsers(users);
    }, (error) => {
      console.error('Firestore Error users:', error);
    });

    return () => {
      unsubPrices();
      unsubAccounts();
      unsubUsers();
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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

  const registerUser = async (userData: Omit<User, 'id' | 'role' | 'balance'>) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        role: 'USER',
        balance: 0,
      });
      const newUser: User = {
        id: docRef.id,
        ...userData,
        role: 'USER',
        balance: 0,
      };
      setUser(newUser);
    } catch(err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi tạo tài khoản', 'error');
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addAccount = async (acc: Omit<AccountProduct, 'id'>) => {
    try {
      await addDoc(collection(db, 'accounts'), acc);
      showToast('Đăng sản phẩm thành công');
    } catch(err) {
      console.error('Error adding document: ', err);
      showToast('Không thể thêm sản phẩm, vui lòng thử lại', 'error');
    }
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

  const updateServicePrices = async (prices: ServicePrices) => {
    try {
      await setDoc(doc(db, 'settings', 'prices'), prices);
      showToast('Cập nhật bảng giá thành công!');
    } catch(err) {
      console.error(err);
      showToast('Có lỗi khi cập nhật bảng giá', 'error');
    }
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

