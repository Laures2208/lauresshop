import React from 'react';
import { CreditCard, Smartphone } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-gray-900 group cursor-pointer border border-transparent hover:border-red-600/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply z-10 pointer-events-none"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=1200" 
              alt="Sá»± kiá»‡n Liên Quân" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />
            
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20">
              <div className="inline-block bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded mb-2 uppercase">Sự kiện hot</div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase mb-1 sm:mb-2 leading-none text-white drop-shadow-lg">
                Mùa Giải Mới <br className="hidden sm:block" /><span className="text-red-500 font-serif italic">Lên Rank Cùng Cao Thủ</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 max-w-sm drop-shadow-md">Giảm giá lên đến 50% cho các dịch vụ cày thuê và tài khoản VIP.</p>
              <div className="flex gap-2 sm:gap-3">
                <button className="px-4 sm:px-6 py-2 bg-white text-black font-black text-[10px] sm:text-xs uppercase rounded hover:bg-gray-200 transition-colors">Xem Ngay</button>
                <button className="px-4 sm:px-6 py-2 border border-white/30 backdrop-blur-sm font-black text-[10px] sm:text-xs uppercase rounded text-white hover:bg-white/10 transition-colors">Săn Quà</button>
              </div>
            </div>
            
             <div className="absolute inset-0 bg-[#222] flex items-center justify-center text-5xl sm:text-8xl font-black text-white/5 uppercase select-none pointer-events-none mix-blend-overlay">
                ARENA OF VALOR
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-bold uppercase text-xs sm:text-sm tracking-wide transition-colors">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              Nạp tiền chuyển khoản
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1f1f1f] text-white p-3 rounded-xl font-bold border border-gray-800 transition-colors uppercase text-xs sm:text-sm tracking-wide">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              Nạp thẻ cào
            </button>
          </div>
        </div>

        {/* Top Nạp */}
        <div className="bg-[#141414] border border-gray-800 rounded-2xl flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
               Bảng Xếp Hạng
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded uppercase">Tuần này</span>
              <span className="text-[10px] font-bold text-gray-400 px-2 py-0.5 cursor-pointer hover:text-white uppercase transition-colors">Tháng này</span>
            </div>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`flex items-center gap-3 p-3 rounded-r-lg transition-colors ${
                  i === 1 ? 'bg-gradient-to-r from-red-600/20 to-transparent border-l-2 border-red-600' : 'hover:bg-[#1f1f1f]'
                }`}
              >
                <span className={`font-black text-xl italic ${
                  i === 1 ? 'text-red-600' : 
                  i === 2 ? 'text-gray-300' : 
                  i === 3 ? 'text-amber-700' : 'text-gray-700'
                }`}>
                  0{i}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">nguoichoi_vip_{i}</p>
                  <p className="text-[10px] text-gray-400 uppercase">{(10000000 / i).toLocaleString()} VNĐ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
