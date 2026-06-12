import React from 'react';
import { useShop } from '../context/ShopContext';
import { Star, Shield } from 'lucide-react';
import { AccountProduct } from '../types';

export const AccountList: React.FC = () => {
  const { accounts, addToCart, showToast } = useShop();

  const handleAddToCart = (acc: AccountProduct) => {
    addToCart({
      type: 'ACCOUNT',
      title: acc.title,
      price: acc.price,
      details: { accountId: acc.id }
    });
    showToast(`Đã thêm ${acc.title} vào giỏ hàng`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold uppercase border-l-4 border-red-600 pl-3">Tài Khoản Game</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
           Xem tất cả <span className="text-red-500 font-bold">&rarr;</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-[#141414] border border-gray-800 rounded-xl flex flex-col overflow-hidden hover:border-red-600/30 transition-all group hover:-translate-y-1">
            <div className="relative h-40 bg-[#1f1f1f] flex items-center justify-center overflow-hidden">
               {acc.discountPercentage && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded uppercase z-10">
                  -{acc.discountPercentage}%
                </div>
              )}
               <div className="absolute top-2 left-2 text-gray-400 font-bold uppercase text-[9px] sm:text-[10px] bg-black/50 px-2 py-0.5 rounded z-10 backdrop-blur-sm">
                  Acc Game #{acc.id.substring(2, 6)}
              </div>
              <img 
                src={acc.imageUrl} 
                alt={acc.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />
            </div>

             <div className="p-3 flex flex-col flex-1">
              <h3 className="text-sm font-bold truncate text-gray-100" title={acc.title}>{acc.title}</h3>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs text-gray-400 mt-3 mb-3">
                {acc.rank && (
                   <div className="flex items-center gap-1 bg-[#1f1f1f] border border-gray-800 px-2 py-1 rounded">
                    <Shield className="w-3 h-3 text-red-500" />
                    <span className="truncate">{acc.rank}</span>
                  </div>
                )}
                {acc.champions !== undefined && (
                   <div className="flex items-center gap-1 bg-[#1f1f1f] border border-gray-800 px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{acc.champions} Tướng</span>
                  </div>
                )}
                 {acc.skins !== undefined && (
                   <div className="flex items-center gap-1 bg-[#1f1f1f] border border-gray-800 px-2 py-1 rounded col-span-2">
                    <Star className="w-3 h-3 text-purple-500" />
                    <span>{acc.skins} Trang phục</span>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-red-500 font-bold text-sm sm:text-base">
                    {acc.price.toLocaleString()}đ
                  </span>
                  {acc.originalPrice && (
                    <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                      {acc.originalPrice.toLocaleString()}đ
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleAddToCart(acc)}
                  className="w-full mt-3 py-2 sm:py-2.5 bg-[#1f1f1f] hover:bg-red-600/20 hover:text-red-500 border border-gray-800 text-[10px] sm:text-xs font-bold uppercase transition-all rounded text-gray-300"
                  title="Thêm vào giỏ hàng"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
