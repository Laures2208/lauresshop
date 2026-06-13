import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Clock, Gamepad2, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="p-2 border border-blue-500/50 bg-blue-900/20 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            <Gamepad2 className="w-8 h-8 text-blue-500" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Thuê Slot Chơi Game</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium italic">Chơi cùng các game thủ rank cao, leo rank thần tốc</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#141414]/90 backdrop-blur-md border border-blue-900/40 p-6 sm:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative overflow-hidden shadow-[0_10px_30px_max(rgba(59,130,246,0.1),_rgba(0,0,0,0.5))]"
      >
        {/* Background decorative element */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 pointer-events-none opacity-20"
        >
           <Gamepad2 className="w-80 h-80 text-blue-500" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />

        <div className="space-y-4 relative z-10">
           <h3 className="text-xl sm:text-2xl font-black text-gray-100 uppercase tracking-tight flex-wrap drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Kỹ năng đỉnh cao <br className="hidden sm:block" /> Vui vẻ nhiệt tình</h3>
           <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
             Bạn cần đồng đội kéo rank hay đơn giản là người chơi cùng cho đỡ chán? 
             Thuê ngay các pro-player của chúng tôi với mức giá cực rẻ.
           </p>
           <ul className="text-sm text-gray-300 space-y-3 mt-4">
             <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> <span className="font-medium text-gray-300">Cam kết mictalk 100%</span></li>
             <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> <span className="font-medium text-gray-300">Đa dạng bể tướng, call team chuẩn</span></li>
             <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> <span className="font-medium text-gray-300">Hỗ trợ leo rank thần tốc</span></li>
           </ul>
        </div>

        <div className="bg-black/60 p-6 rounded-xl border border-gray-800 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] relative z-10 backdrop-blur-sm">
          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Số giờ muốn thuê
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => setHours(Math.max(1, hours - 1))}
                className="bg-[#1f1f1f] hover:bg-gray-800 border border-gray-800 border-r-0 text-white px-4 py-2 sm:py-3 rounded-l-md font-bold transition-colors shadow-inner"
              >-</button>
              <input 
                type="number" 
                min="1" 
                value={hours} 
                onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#1f1f1f] border-y border-gray-800 text-center py-2 sm:py-3 text-white font-black focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
              />
              <button 
                onClick={() => setHours(hours + 1)}
                className="bg-[#1f1f1f] hover:bg-gray-800 border border-gray-800 border-l-0 text-white px-4 py-2 sm:py-3 rounded-r-md font-bold transition-colors shadow-inner"
              >+</button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-800/80 pt-5 mb-6">
            <span className="text-gray-400 font-bold uppercase text-xs">Tổng tiền:</span>
            <AnimatePresence mode="popLayout">
              <motion.span 
                key={totalPrice}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-2xl sm:text-3xl font-black text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              >
                {totalPrice.toLocaleString()}đ
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.button 
            whileHover={{ y: -2 }}
            whileTap={{ y: 2, scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-t from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 border-b-4 border-blue-950 py-3 sm:py-4 rounded-lg font-black uppercase tracking-wider text-xs sm:text-sm text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] transition-all"
          >
            <ShoppingCart className="w-5 h-5 drop-shadow-md" />
            Đăng Ký Thuê
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};
