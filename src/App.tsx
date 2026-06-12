/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';

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
          </Routes>
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}
