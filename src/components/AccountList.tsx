import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Star, Shield, Sword } from 'lucide-react';
import { AccountProduct } from '../types';
import { motion } from 'motion/react';
import { AccountCard3D } from './AccountCard3D';

export const AccountList: React.FC = () => {
  const { accounts, categories, addToCart, showToast } = useShop();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const handleAddToCart = (acc: AccountProduct) => {
    addToCart({
      type: 'ACCOUNT',
      title: acc.title,
      price: acc.price,
      details: { accountId: acc.id }
    });
    showToast(`Đã thêm ${acc.title} vào giỏ hàng`);
  };

  const filteredAccounts = accounts.filter(acc => {
    if (acc.isSold) return false;
    if (selectedCategoryId === 'all') return true;
    return acc.categoryId === selectedCategoryId;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 border border-red-500/50 bg-red-900/20 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          >
            <Sword className="w-8 h-8 text-red-500" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">Tài Khoản Game</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium italic">Lựa chọn tài khoản game vip, an toàn, giao dịch nhanh chóng</p>
          </div>
        </div>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-800/60 pb-6">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategoryId('all')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg border backdrop-blur-sm transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]'
                : 'bg-[#141414]/80 border-gray-700 text-gray-400 hover:text-white hover:border-red-900 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]'
            }`}
          >
            <span className="flex items-center gap-2">Tất Cả <span className="bg-black/50 px-2 py-0.5 rounded-full text-[10px]">{accounts.filter(a => !a.isSold).length}</span></span>
          </motion.button>
          
          {categories.map(cat => {
            const count = accounts.filter(a => !a.isSold && a.categoryId === cat.id).length;
            return (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg border backdrop-blur-sm transition-all ${
                  selectedCategoryId === cat.id
                    ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]'
                    : 'bg-[#141414]/80 border-gray-700 text-gray-400 hover:text-white hover:border-red-900 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                }`}
              >
                <span className="flex items-center gap-2">{cat.name} <span className="bg-black/50 px-2 py-0.5 rounded-full text-[10px]">{count}</span></span>
              </motion.button>
            );
          })}
        </div>
      )}

      {filteredAccounts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141414]/80 backdrop-blur-md border border-gray-800 rounded-xl p-10 text-center text-gray-400 italic font-medium shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-900/5 pulse-slow" />
          <Sword className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50" />
          <p>Không có tài khoản game nào thuộc danh mục này đang mở bán.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredAccounts.map((acc, idx) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5, type: "spring" }}
            >
              <AccountCard3D account={acc} onAddToCart={handleAddToCart} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
