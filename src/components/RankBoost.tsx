import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { TrendingUp, ShoppingCart, Target, Star } from 'lucide-react';
import { cn } from '../lib/utils';

type BoostType = 'BASIC' | 'STAR' | 'COMBO1' | 'COMBO2';

export const RankBoost: React.FC = () => {
  const [boostType, setBoostType] = useState<BoostType>('BASIC');
  const [basicRank, setBasicRank] = useState('DONG'); // Dong, Bac, Vang, BachKim
  const [stars, setStars] = useState<number>(1);
  const { addToCart, servicePrices } = useShop();

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
      case 'BASIC': 
        const ranks: Record<string, string> = { DONG: 'Đồng', BAC: 'Bạc', VANG: 'Vàng', BACHKIM: 'Bạch Kim' };
        return `Cày rank: ${ranks[basicRank]} lên Cao Thủ`;
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
    alert('Đã thêm dịch vụ cày thuê vào giỏ hàng');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold uppercase border-l-4 border-red-600 pl-3">Dịch Vụ Cày Thuê</h2>
      </div>

      <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        
        {/* Type Selection Sidebar */}
        <div className="lg:w-1/3 bg-[#0a0a0a] border-r border-gray-800 p-6 sm:p-8 flex flex-col gap-3">
          <h3 className="font-black text-red-500 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Chọn Gói Cày
          </h3>
          {[
            { id: 'BASIC', label: 'Cơ Bản (Lên Cao Thủ)' },
            { id: 'STAR', label: 'Theo Sao (Cao Thủ)' },
            { id: 'COMBO1', label: 'Đồng → Chiến Tướng' },
            { id: 'COMBO2', label: 'Cao Thủ → Chiến Tướng' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setBoostType(type.id as BoostType)}
              className={cn(
                "text-left px-5 py-3.5 rounded-lg font-bold text-sm transition-all border",
                boostType === type.id 
                  ? "bg-red-900/20 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]" 
                  : "bg-[#1f1f1f] border-gray-800 text-gray-400 hover:bg-[#252525] hover:text-gray-200"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Configuration Area */}
        <div className="p-6 sm:p-8 lg:w-2/3 flex flex-col justify-between">
          <div className="mb-8">
            {/* Dynamic Form based on type */}
            {boostType === 'BASIC' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                  <TrendingUp className="w-6 h-6 text-red-500" /> Cày Định Mức Lên Cao Thủ
                </h4>
                <p className="text-sm text-gray-400">Đồng giá {servicePrices.boostBasic.toLocaleString()}đ bất kể mức rank hiện tại.</p>
                <div className="mt-6">
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Rank Hiện Tại Của Bạn</label>
                  <select 
                    value={basicRank}
                    onChange={(e) => setBasicRank(e.target.value)}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="DONG">Đồng</option>
                    <option value="BAC">Bạc</option>
                    <option value="VANG">Vàng</option>
                    <option value="BACHKIM">Bạch Kim</option>
                  </select>
                </div>
              </div>
            )}

            {boostType === 'STAR' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                  <Star className="w-6 h-6 text-yellow-500" /> Cày Sao Cao Thủ Trở Lên
                </h4>
                <p className="text-sm text-gray-400">Giá: {servicePrices.boostStar.toLocaleString()}đ / 1 Sao. Uy tín, tốc độ bàn thờ.</p>
                <div className="mt-6">
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Số Sao Cần Cày</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={stars} 
                    onChange={(e) => setStars(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="Nhập số sao..."
                  />
                </div>
              </div>
            )}

            {boostType === 'COMBO1' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                   Combo Đồng Lên Chiến Tướng
                </h4>
                <p className="text-sm text-gray-400">Trọn gói từ zero (Đồng) đến hero (Chiến tướng). Giá siêu hời {servicePrices.boostCombo1.toLocaleString()}đ.</p>
              </div>
            )}

            {boostType === 'COMBO2' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                   Combo Cao Thủ Lên Chiến Tướng
                </h4>
                <p className="text-sm text-gray-400">Bứt phá nốt chặng cuối lên Chiến Tướng. Chỉ {servicePrices.boostCombo2.toLocaleString()}đ.</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto p-4 bg-[#0a0a0a] rounded border border-gray-800 flex-1 sm:mr-4">
              <div className="flex justify-between items-center sm:justify-start sm:gap-4">
                <span className="text-xs font-bold uppercase text-gray-400">Thành tiền:</span>
                <span className="text-2xl font-black text-red-600">{getPrice().toLocaleString()}đ</span>
              </div>
            </div>
            <button 
              onClick={handleAddToCart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded font-bold uppercase tracking-wide transition-all shadow-lg shadow-red-900/30"
            >
              <ShoppingCart className="w-5 h-5" />
              Đăng Ký Thuê
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
