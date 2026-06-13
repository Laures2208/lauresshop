/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';

const ToastManager = () => {
  const { toast } = useShop();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      {toast && (
        <div className={`px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          toast.type === 'success' ? 'bg-green-900/90 border-green-500/50 text-green-100' : 'bg-red-900/90 border-red-500/50 text-red-100'
        }`}>
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <div className="font-sans text-gray-100 bg-black min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <ToastManager />
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}
