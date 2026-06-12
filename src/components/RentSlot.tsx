import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Clock, Gamepad2, ShoppingCart } from 'lucide-react';

export const RentSlot: React.FC = () => {
  const [hours, setHours] = useState<number>(1);
  const { addToCart, servicePrices, showToast } = useShop();

  const PRICE_PER_HOUR = servicePrices.rentPerHour;
  const totalPrice = hours * PRICE_PER_HOUR;

  const handleAddToCart = () => {
    addToCart({
      type: 'SLOT',
      title: `Thuê slot chơi cùng (${hours} giờ)`,
      price: totalPrice,
      details: { hours }
    });
    showToast('Đã thêm slot thuê vào giỏ hàng');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold uppercase border-l-4 border-red-600 pl-3">Thuê Slot Chơi Cùng</h2>
      </div>

      <div className="bg-[#141414] border border-gray-800 p-6 sm:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative overflow-hidden">
        {/* Background decorative element */}
        <Gamepad2 className="absolute -bottom-10 -right-10 w-64 h-64 text-gray-900/20 -rotate-12 pointer-events-none" />

        <div className="space-y-4 relative z-10">
           <h3 className="text-xl sm:text-2xl font-black text-gray-100 uppercase tracking-tight">Kỹ năng đỉnh cao - Vui vẻ nhiệt tình</h3>
           <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
             Bạn cần đồng đội kéo rank hay đơn giản là người chơi cùng cho đỡ chán? 
             Thuê ngay các pro-player của chúng tôi với mức giá cực rẻ.
           </p>
           <ul className="text-sm text-gray-300 space-y-3 mt-4">
             <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div> <span className="font-medium text-gray-300">Cam kết mictalk 100%</span></li>
             <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div> <span className="font-medium text-gray-300">Đa dạng bể tướng, call team chuẩn</span></li>
             <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div> <span className="font-medium text-gray-300">Hỗ trợ leo rank thần tốc</span></li>
           </ul>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-xl border border-gray-800 shadow-xl relative z-10">
          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              Số giờ muốn thuê
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => setHours(Math.max(1, hours - 1))}
                className="bg-[#1f1f1f] hover:bg-gray-800 border border-gray-800 border-r-0 text-white px-4 py-2 sm:py-3 rounded-l-md font-bold transition-colors"
              >-</button>
              <input 
                type="number" 
                min="1" 
                value={hours} 
                onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#1f1f1f] border-y border-gray-800 text-center py-2 sm:py-3 text-white font-black focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button 
                onClick={() => setHours(hours + 1)}
                className="bg-[#1f1f1f] hover:bg-gray-800 border border-gray-800 border-l-0 text-white px-4 py-2 sm:py-3 rounded-r-md font-bold transition-colors"
              >+</button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-800 pt-5 mb-6">
            <span className="text-gray-400 font-bold uppercase text-xs">Tổng tiền:</span>
            <span className="text-2xl sm:text-3xl font-black text-red-600">{totalPrice.toLocaleString()}đ</span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 sm:py-4 rounded font-bold uppercase text-xs sm:text-sm shadow-lg shadow-red-900/30 hover:bg-red-700 transition-all tracking-wide"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </section>
  );
};
