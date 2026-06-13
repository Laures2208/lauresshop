import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { TrendingUp, ShoppingCart, Target, Star, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type BoostType = 'BASIC' | 'STAR' | 'COMBO1' | 'COMBO2';

export const RankBoost: React.FC = () => {
  const [boostType, setBoostType] = useState<BoostType>('BASIC');
  const [basicRank, setBasicRank] = useState('DONG'); // Dong, Bac, Vang, BachKim
  const [stars, setStars] = useState<number>(1);
  const { addToCart, servicePrices, showToast } = useShop();

  const getPrice = () => {
    switch (boostType) {
      case 'BASIC': return servicePrices.boostBasic;
      case 'STAR': return stars * servicePrices.boostStar;
      case 'COMBO1': return servicePrices.boostCombo1;
      case 'COMBO2': return servicePrices.boostCombo2;
      default: return 0;
    }
  };

  const getTitle = () => {
    switch (boostType) {
      case 'BASIC': {
        const ranks: Record<string, string> = { DONG: 'Đồng', BAC: 'Bạc', VANG: 'Vàng', BACHKIM: 'Bạch Kim' };
        return `Cày rank: ${ranks[basicRank]} lên Cao Thủ`;
      }
      case 'STAR': return `Cày rank: ${stars} sao (Cao Thủ trở lên)`;
      case 'COMBO1': return `Cày rank: Combo Đồng lên Chiến Tướng`;
      case 'COMBO2': return `Cày rank: Combo Cao Thủ lên Chiến Tướng`;
    }
  };

  const handleAddToCart = () => {
    addToCart({
      type: 'BOOST',
      title: getTitle(),
      price: getPrice(),
      details: { boostType, basicRank, stars }
    });
    showToast('Đã thêm dịch vụ cày thuê vào giỏ hàng');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="p-2 border border-yellow-500/50 bg-yellow-900/20 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.5)]"
          >
            <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,1)]" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-white drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">Dịch Vụ Cày Thuê</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium italic">Thăng hạng nhanh chóng, uy tín và bảo mật tuyệt đối</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#141414]/90 backdrop-blur-md border border-yellow-900/40 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-[0_10px_30px_max(rgba(234,179,8,0.1),_rgba(0,0,0,0.5))] relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-red-600/5 pointer-events-none" />

        {/* Type Selection Sidebar */}
        <div className="lg:w-1/3 bg-black/60 border-r border-gray-800 p-6 sm:p-8 flex flex-col gap-3 relative z-10 backdrop-blur-sm">
          <h3 className="font-black text-yellow-500 uppercase tracking-widest text-xs mb-4 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
            <Target className="w-4 h-4" />
            Chọn Gói Cày
          </h3>
          {[
            { id: 'BASIC', label: 'Cơ Bản (Lên Cao Thủ)' },
            { id: 'STAR', label: 'Theo Sao (Cao Thủ)' },
            { id: 'COMBO1', label: 'Đồng → Chiến Tướng' },
            { id: 'COMBO2', label: 'Cao Thủ → Chiến Tướng' }
          ].map((type) => (
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              key={type.id}
              onClick={() => setBoostType(type.id as BoostType)}
              className={cn(
                "text-left px-5 py-3.5 rounded-lg font-bold text-sm transition-all border shadow-inner",
                boostType === type.id 
                  ? "bg-gradient-to-r from-yellow-900/40 to-yellow-600/10 border-yellow-600 text-white shadow-[0_0_15px_rgba(234,179,8,0.3)]" 
                  : "bg-[#1f1f1f]/80 border-gray-800/80 text-gray-400 hover:text-gray-200 hover:border-yellow-900/50"
              )}
            >
              {type.label}
            </motion.button>
          ))}
        </div>

        {/* Configuration Area */}
        <div className="p-6 sm:p-8 lg:w-2/3 flex flex-col justify-between relative z-10">
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={boostType}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Dynamic Form based on type */}
                {boostType === 'BASIC' && (
                  <>
                    <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight drop-shadow-md">
                      <TrendingUp className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" /> Cày Định Mức Lên Cao Thủ
                    </h4>
                    <p className="text-sm text-gray-400">Đồng giá {servicePrices.boostBasic.toLocaleString()}đ bất kể mức rank hiện tại.</p>
                    <div className="mt-8 bg-black/40 p-5 rounded-xl border border-gray-800 shadow-inner">
                      <label className="block text-xs font-black uppercase text-gray-500 mb-3 tracking-widest">Rank Hiện Tại Của Bạn</label>
                      <select 
                        value={basicRank}
                        onChange={(e) => setBasicRank(e.target.value)}
                        className="w-full bg-[#1f1f1f] border border-gray-700/80 rounded py-3 md:py-4 px-4 text-sm text-white focus:outline-none focus:border-yellow-600 transition-colors shadow-inner"
                      >
                        <option value="DONG">Đồng</option>
                        <option value="BAC">Bạc</option>
                        <option value="VANG">Vàng</option>
                        <option value="BACHKIM">Bạch Kim</option>
                      </select>
                    </div>
                  </>
                )}

                {boostType === 'STAR' && (
                  <>
                    <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight drop-shadow-md">
                      <Star className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" /> Cày Sao Cao Thủ Trở Lên
                    </h4>
                    <p className="text-sm text-gray-400">Giá: {servicePrices.boostStar.toLocaleString()}đ / 1 Sao. Uy tín, tốc độ bàn thờ.</p>
                    <div className="mt-8 bg-black/40 p-5 rounded-xl border border-gray-800 shadow-inner">
                      <label className="block text-xs font-black uppercase text-gray-500 mb-3 tracking-widest">Số Sao Cần Cày</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={stars} 
                        onChange={(e) => setStars(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-[#1f1f1f] border border-gray-700/80 rounded py-3 md:py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-yellow-600 transition-colors shadow-inner"
                        placeholder="Nhập số sao..."
                      />
                    </div>
                  </>
                )}

                {boostType === 'COMBO1' && (
                  <div className="mt-4">
                    <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight drop-shadow-md">
                       Combo Đồng Lên Chiến Tướng
                    </h4>
                    <p className="text-sm text-gray-400 mt-2">Trọn gói từ zero (Đồng) đến hero (Chiến tướng). Giá siêu hời {servicePrices.boostCombo1.toLocaleString()}đ.</p>
                    <div className="mt-6 flex justify-center opacity-30 pointer-events-none">
                      <Trophy className="w-32 h-32 text-yellow-500" />
                    </div>
                  </div>
                )}

                {boostType === 'COMBO2' && (
                  <div className="mt-4">
                    <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight drop-shadow-md">
                       Combo Cao Thủ Lên Chiến Tướng
                    </h4>
                    <p className="text-sm text-gray-400 mt-2">Bứt phá nốt chặng cuối lên Chiến Tướng. Chỉ {servicePrices.boostCombo2.toLocaleString()}đ.</p>
                    <div className="mt-6 flex justify-center opacity-30 pointer-events-none">
                      <Trophy className="w-32 h-32 text-red-500" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800/80">
            <div className="w-full sm:w-auto p-4 bg-black/40 rounded-xl border border-gray-800 flex-1 sm:mr-4 shadow-inner">
              <div className="flex justify-between items-center sm:justify-start sm:gap-4">
                <span className="text-xs font-bold uppercase text-gray-400">Thành tiền:</span>
                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={getPrice()}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl sm:text-3xl font-black text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                  >
                    {getPrice().toLocaleString()}đ
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            {/* 3D Button */}
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-t from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 border-b-4 border-red-950 px-8 py-3.5 sm:py-4 rounded-lg font-black uppercase tracking-wider text-xs sm:text-sm text-white shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all"
            >
              <ShoppingCart className="w-5 h-5 drop-shadow-md" />
              Đăng Ký Thuê
            </motion.button>
          </div>
        </div>

      </motion.div>
    </section>
  );
};
