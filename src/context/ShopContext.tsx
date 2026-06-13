import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccountProduct, CartItem, ServicePrices, Order, Category } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, setDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ShopContextType {
  user: User | null;
  login: (username: string, password?: string) => boolean;
  registerUser: (user: Omit<User, 'id' | 'role' | 'balance'>) => Promise<boolean>;
  logout: () => void;
  accounts: AccountProduct[];
  addAccount: (acc: Omit<AccountProduct, 'id'>) => void;
  deleteAccount: (id: string) => Promise<boolean>;
  categories: Category[];
  addCategory: (name: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: 'QR' | 'CARD', customOrderId?: string) => Promise<boolean>;
  orders: Order[];
  deleteUser: (id: string) => void;
  updateUser: (id: string, data: Partial<User>) => Promise<boolean>;
  registeredUsers: User[];
  servicePrices: ServicePrices;
  updateServicePrices: (prices: ServicePrices) => void;
  toast: { message: string, type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEFAULT_PRICES: ServicePrices = {
  rentPerHour: 8000,
  boostBasic: 50000,
  boostStar: 3000,
  boostCombo1: 100000,
  boostCombo2: 50000,
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<AccountProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [servicePrices, setServicePrices] = useState<ServicePrices>(DEFAULT_PRICES);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [usersLoaded, setUsersLoaded] = useState<boolean>(false);

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
      handleFirestoreError(error, OperationType.GET, 'settings/prices');
    });

    const unsubAccounts = onSnapshot(collection(db, 'accounts'), (snapshot) => {
      const accs = snapshot.docs.map(accDoc => ({ id: accDoc.id, ...accDoc.data() } as AccountProduct));
      setAccounts(accs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'accounts');
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const cats = snapshot.docs.map(catDoc => ({ id: catDoc.id, ...catDoc.data() } as Category));
      cats.sort((a, b) => a.createdAt - b.createdAt);
      setCategories(cats);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(userDoc => ({ id: userDoc.id, ...userDoc.data() } as User));
      setRegisteredUsers(users);
      setUsersLoaded(true);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ords = snapshot.docs.map(ordDoc => ({ id: ordDoc.id, ...ordDoc.data() } as Order));
      setOrders(ords);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => {
      unsubPrices();
      unsubAccounts();
      unsubCategories();
      unsubUsers();
      unsubOrders();
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

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && usersLoaded) {
      const stillExists = registeredUsers.some(u => u.id === user.id);
      if (!stillExists) {
        logout();
        showToast('Tài khoản của bạn đã bị xóa khỏi hệ thống!', 'error');
      }
    }
  }, [user, registeredUsers, usersLoaded]);

  const login = (username: string, password?: string) => {
    if (username === 'Laures2208' && password === 'THPA29122008') {
      const adminUser: User = { id: 'admin', username: 'Laures2208', role: 'ADMIN', balance: 0 };
      setUser(adminUser);
      return true;
    }

    const existingUser = registeredUsers.find(u => u.username === username);
    if (existingUser && existingUser.password === password) {
      setUser(existingUser);
      return true;
    }
    
    return false;
  };

  const registerUser = async (userData: Omit<User, 'id' | 'role' | 'balance'>) => {
    // Kiếm tra trùng lặp thông tin
    for (const u of registeredUsers) {
      if (u.username === userData.username) {
        showToast('Tên đăng nhập đã được sử dụng', 'error');
        return false;
      }
      if (userData.email && u.email === userData.email) {
         showToast('Email đã được sử dụng', 'error');
         return false;
      }
      if (userData.phone && u.phone === userData.phone) {
         showToast('Số điện thoại đã được sử dụng', 'error');
         return false;
      }
    }

    try {
      const cleanUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, v]) => v !== undefined)
      );
      const docRef = await addDoc(collection(db, 'users'), {
        ...cleanUserData,
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
      showToast('Đăng ký tài khoản thành công!');
      return true;
    } catch(err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi tạo tài khoản', 'error');
      handleFirestoreError(err, OperationType.CREATE, 'users');
      return false;
    }
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    try {
      const { id, role, ...updateData } = data;
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'users', userId), cleanUpdateData, { merge: true });
      showToast('Cập nhật tài khoản thành công!');
      return true;
    } catch(err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi cập nhật', 'error');
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { deleteDoc, collection, query, where, getDocs } = await import('firebase/firestore');
      
      // Xoá tài khoản người dùng
      await deleteDoc(doc(db, 'users', userId));

      // Xoá toàn bộ lịch sử đơn hàng (dự liệu mua hàng) của tài khoản bị xoá
      const q = query(collection(db, 'orders'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);

      showToast('Đã xoá tài khoản và toàn bộ lịch sử mua hàng!');
    } catch(err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi xoá', 'error');
      handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addAccount = async (acc: Omit<AccountProduct, 'id'>) => {
    try {
      const cleanAccData = Object.fromEntries(
        Object.entries(acc).filter(([_, value]) => value !== undefined)
      );
      await addDoc(collection(db, 'accounts'), cleanAccData);
      showToast('Đăng sản phẩm thành công');
    } catch(err) {
      console.error('Error adding document: ', err);
      showToast('Không thể thêm sản phẩm, vui lòng thử lại', 'error');
    }
  };

  const deleteAccount = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'accounts', id));
      showToast('Xóa tài khoản thành công!');
      return true;
    } catch(err) {
      console.error('Error deleting document: ', err);
      showToast('Không thể xóa sản phẩm, vui lòng thử lại', 'error');
      handleFirestoreError(err, OperationType.DELETE, `accounts/${id}`);
      return false;
    }
  };

  const addCategory = async (name: string): Promise<boolean> => {
    try {
      await addDoc(collection(db, 'categories'), {
        name,
        createdAt: Date.now()
      });
      showToast('Đã thêm danh mục mới');
      return true;
    } catch(err) {
      console.error('Error adding category: ', err);
      showToast('Không thể thêm danh mục, vui lòng thử lại', 'error');
      handleFirestoreError(err, OperationType.CREATE, 'categories');
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      showToast('Xóa danh mục thành công');
      return true;
    } catch(err) {
      console.error('Error deleting category: ', err);
      showToast('Không thể xóa danh mục, vui lòng thử lại', 'error');
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
      return false;
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

  const placeOrder = async (paymentMethod: 'QR' | 'CARD', customOrderId?: string) => {
    if (!user) return false;
    if (cart.length === 0) return false;

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    const newOrder: Omit<Order, 'id'> = {
      userId: user.id,
      items: cart,
      totalAmount,
      status: 'PENDING',
      createdAt: Date.now(),
      paymentMethod
    };

    try {
      if (customOrderId) {
        await setDoc(doc(db, 'orders', customOrderId), newOrder);
      } else {
        await addDoc(collection(db, 'orders'), newOrder);
      }
      clearCart();
      return true;
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi tạo đơn hàng', 'error');
      handleFirestoreError(err, OperationType.CREATE, customOrderId ? `orders/${customOrderId}` : 'orders');
      return false;
    }
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
      accounts, addAccount, deleteAccount,
      categories, addCategory, deleteCategory,
      cart, addToCart, removeFromCart, clearCart,
      placeOrder, orders,
      updateUser, deleteUser,
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

