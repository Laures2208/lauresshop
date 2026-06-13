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
import { BackgroundParticles } from './components/BackgroundParticles';

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
        <div className="font-sans text-gray-100 min-h-screen relative overflow-hidden bg-black">
          {/* Game Vibe Background Image */}
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
            style={{ 
              backgroundImage: 'url("https://images2.alphacoders.com/131/1318041.jpeg")' // A cool sci-fi/game arena background
            }}
          />
          {/* Dark Overlay for better contrast */}
          <div className="fixed inset-0 z-0 bg-black/70 bg-gradient-to-t from-black/90 via-black/60 to-black/80" />
          
          <BackgroundParticles />

          {/* Actual Content Wrapper */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </div>
          <ToastManager />
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}
