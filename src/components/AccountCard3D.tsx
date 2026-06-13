import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Shield, Star, ShoppingCart } from 'lucide-react';
import { AccountProduct } from '../types';

interface AccountCard3DProps {
  account: AccountProduct;
  onAddToCart: (acc: AccountProduct) => void;
}

export const AccountCard3D: React.FC<AccountCard3DProps> = ({ account, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D rotation logic
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(200);
    y.set(200);
  }

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
      className="relative z-10 mx-auto w-full h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-full min-h-[380px] bg-[#141414]/80 backdrop-blur-sm border border-gray-800/60 rounded-xl flex flex-col group shadow-lg"
      >
        {/* Glow behind card */}
        <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-xl -z-10" />

        <div className="relative h-48 bg-black flex items-center justify-center overflow-hidden rounded-t-xl" style={{ transform: "translateZ(30px)" }}>
          {account.discountPercentage && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(220,38,38,1)] uppercase z-20">
              -{account.discountPercentage}%
            </div>
          )}
          <div className="absolute top-2 left-2 text-gray-200 font-bold uppercase text-[9px] sm:text-[10px] bg-black/70 border border-gray-600 px-2 py-0.5 rounded z-20 backdrop-blur-sm">
            Acc Game #{account.id.substring(2, 6)}
          </div>
          
          <img 
            src={account.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80'} 
            alt={account.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-80" 
          />

          {/* Reveal Content on Hover - Slideshow of VIP Skins vibe */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-4 text-center"
              >
                {/* Fake VIP Skin showcase */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-16 h-16 rounded-full border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)] overflow-hidden mb-2"
                >
                   <img src="https://media.discordapp.net/attachments/1118837330261311549/1118873426210852924/image.png?width=400&height=400" alt="VIP Skin" className="w-full h-full object-cover" />
                </motion.div>
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-yellow-400 font-black text-xs uppercase tracking-wider drop-shadow-md"
                >
                  Skin VIP - Siêu Việt
                </motion.span>
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-[10px] mt-1"
                >
                  Click để xem chi tiết
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />
        </div>

        <div className="p-4 flex flex-col flex-1" style={{ transform: "translateZ(40px)" }}>
          <h3 className="text-sm font-bold truncate text-gray-100 group-hover:text-red-400 transition-colors" title={account.title}>{account.title}</h3>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs text-gray-300 mt-3 mb-4">
            {account.rank && (
              <div className="flex items-center gap-1.5 bg-[#1f1f1f]/80 shadow-inner border border-gray-700/50 px-2 py-1.5 rounded">
                <Shield className="w-3.5 h-3.5 text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]" />
                <span className="truncate font-semibold">{account.rank}</span>
              </div>
            )}
            {account.champions !== undefined && (
              <div className="flex items-center gap-1.5 bg-[#1f1f1f]/80 shadow-inner border border-gray-700/50 px-2 py-1.5 rounded">
                <Star className="w-3.5 h-3.5 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
                <span className="font-semibold">{account.champions} Tướng</span>
              </div>
            )}
            {account.skins !== undefined && (
              <div className="flex items-center gap-1.5 bg-[#1f1f1f]/80 shadow-inner border border-gray-700/50 px-2 py-1.5 rounded col-span-2">
                <Star className="w-3.5 h-3.5 text-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                <span className="font-semibold">{account.skins} Trang phục</span>
              </div>
            )}
          </div>

          <div className="mt-auto block">
            <div className="flex items-center gap-2 mt-2 mb-3">
              <span className="text-red-500 font-black text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]">
                {account.price.toLocaleString()}đ
              </span>
              {account.originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-500 line-through font-medium">
                  {account.originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>
            
            {/* 3D Button */}
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, scale: 0.98 }}
              onClick={() => onAddToCart(account)}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-t from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 border-b-4 border-red-950 font-black uppercase tracking-wider text-xs sm:text-sm text-white rounded-lg shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Thêm vào giỏ
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
