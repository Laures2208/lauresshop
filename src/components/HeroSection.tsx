import React from 'react';
import { motion } from 'motion/react';
import { Sword } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="relative py-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden border-b border-red-900/30 shadow-[inset_0_0_50px_rgba(220,38,38,0.03)]">
      {/* Background glow for hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-gradient-to-br from-red-900/40 to-black border border-red-600/50 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.6)]">
            <Sword className="w-16 h-16 text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,1)]" />
          </div>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
            Laures Shop
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-300 text-sm md:text-base lg:text-lg mb-10 font-medium italic backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-gray-800/50 shadow-inner">
          Khám phá không gian mua sắm eSports đỉnh cao. Tài khoản siêu cấp, cày thuê thần tốc, và thuê slot leo rank uy tín số 1 Việt Nam.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, y: 2 }}
            className="px-8 py-4 bg-gradient-to-t from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 rounded-xl font-black uppercase text-white shadow-[0_10px_20px_rgba(220,38,38,0.5)] border-b-4 border-red-950 transition-all flex items-center justify-center gap-2"
          >
            Mua Acc Ngay
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, y: 2 }}
            className="px-8 py-4 bg-black/60 hover:bg-black/80 rounded-xl font-black uppercase text-gray-300 border-2 border-gray-700 hover:border-red-600 hover:text-white shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center gap-2"
          >
            Xem Dịch Vụ
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
