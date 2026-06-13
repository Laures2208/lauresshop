import React from 'react';
import { ShoppingCart, LogIn, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  const { user, cart, logout } = useShop();

  const totalItems = cart.length;

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-[#141414]/60 backdrop-blur-md border-b border-red-900/40 shadow-[0_4px_30px_rgba(220,38,38,0.1)] h-16 sm:h-20 shrink-0 sticky top-0 z-50">
      <div className="flex-1 w-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            animate={{
              boxShadow: [
                "0px 0px 5px rgba(220,38,38,0.4)",
                "0px 0px 15px rgba(220,38,38,0.8)",
                "0px 0px 5px rgba(220,38,38,0.4)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="rounded-lg p-0.5 bg-gradient-to-br from-red-600 to-red-900"
          >
            <img src="/laures.jpg" alt="Laures Shop Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover bg-black" />
          </motion.div>
          
          <div className="relative overflow-hidden hidden sm:block">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-widest italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Laures <span className="text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]">Shop</span>
            </span>
            {/* Shimmer line on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_forwards] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12" />
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden md:block relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-purple-600 rounded-full blur opacity-50 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản, dịch vụ..."
              className="w-full bg-[#1f1f1f] border border-gray-800 py-2.5 px-5 pl-12 rounded-full text-sm text-white focus:outline-none focus:border-transparent transition-colors font-medium placeholder-gray-500 shadow-inner"
            />
            <div className="absolute left-4 top-2.5 text-red-500/70 group-focus-within:text-red-500 transition-colors pointer-events-none">
              <Search className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors group">
             <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
              <ShoppingCart className="h-5 sm:h-6 w-5 sm:w-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            </motion.div>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_10px_rgba(220,38,38,0.8)] rounded-full border border-red-300">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={user.role === 'ADMIN' ? '/admin' : '/profile'} className="flex items-center gap-2 text-sm font-medium hover:text-red-400 transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 flex items-center justify-center border border-red-900/50 overflow-hidden shadow-[0_0_8px_rgba(220,38,38,0.4)]">
                  <UserIcon className="h-4 sm:h-5 w-4 sm:w-5 text-red-400" />
                </div>
                <span className="hidden lg:block text-xs sm:text-sm">{user.username} {user.role === 'ADMIN' && '(Admin)'}</span>
              </Link>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors group">
                <motion.div whileHover={{ scale: 1.2 }}>
                  <LogOut className="h-4 sm:h-5 w-4 sm:w-5" />
                </motion.div>
              </button>
            </div>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:block">Đăng Nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
