import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ZaloWidget() {
  const [showZalo, setShowZalo] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowZalo(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip pointing to the widget */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-r from-gray-900 to-black text-white px-5 py-3 rounded-lg text-sm sm:text-base font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] relative flex items-center border border-red-500/50 tracking-wider uppercase"
      >
        {/* Techy top-left accent */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500 rounded-tl"></div>
        {/* Techy bottom-right accent */}
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500 rounded-br"></div>
        
        <span className="text-gray-300 mr-2 flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
          CSKH Zalo Admin:
        </span>
        <span className="text-yellow-400 text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] font-black">
          0938587108
        </span>
        {/* Right arrow pointing to icon */}
        <div className="absolute top-1/2 -right-[12px] -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[12px] border-l-red-500/80"></div>
      </motion.div>

      <a
        href="https://zalo.me/0938587108"
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl bg-black border-2 border-red-500 shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_35px_rgba(220,38,38,0.8)] hover:scale-110 transition-all duration-300 overflow-hidden cursor-pointer shrink-0 ring-4 ring-black"
      >
        {/* Revolving border glow effect effect (simulated with large blur) */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-red-600/40 to-transparent"></div>
        
        <AnimatePresence mode="wait">
          {showZalo ? (
            <motion.div
              key="zalo"
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0068FF] to-blue-800"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="text-white font-black text-2xl sm:text-3xl tracking-tighter italic drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10">Zalo</div>
            </motion.div>
          ) : (
            <motion.div
              key="shop"
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="absolute inset-0 flex items-center justify-center bg-black p-1"
            >
              <img src="/laures.jpg" alt="Shop" className="w-full h-full object-cover rounded-xl border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.4)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </a>
    </div>
  );
}
