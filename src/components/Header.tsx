import React from 'react';
import { ShoppingCart, LogIn, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router';

export const Header: React.FC = () => {
  const { user, cart, logout } = useShop();

  const totalItems = cart.length;

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-[#141414] border-b border-red-900/30 shadow-2xl h-16 sm:h-20 shrink-0 sticky top-0 z-50">
      <div className="flex-1 w-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-lg sm:text-xl italic">
            LQ
          </div>
          <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic hidden sm:block">
            Laures <span className="text-red-600">Shop</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản, dịch vụ..."
              className="w-full bg-[#1f1f1f] border border-gray-800 py-2 px-4 pr-10 rounded-full text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
            <div className="absolute right-4 top-2 text-gray-500 pointer-events-none">
              <Search className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 sm:px-5 sm:py-2 bg-red-600 hover:bg-red-700 font-bold rounded text-[10px] sm:text-sm uppercase tracking-wide hidden sm:block transition-colors">
            Nạp Tiền
          </button>
          
          <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <ShoppingCart className="h-5 sm:h-6 w-5 sm:w-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={user.role === 'ADMIN' ? '/admin' : '/'} className="flex items-center gap-2 text-sm font-medium hover:text-red-400 transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600 overflow-hidden">
                  <UserIcon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-300" />
                </div>
                <span className="hidden lg:block text-xs sm:text-sm">{user.username} {user.role === 'ADMIN' && '(Admin)'}</span>
              </Link>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="h-4 sm:h-5 w-4 sm:w-5" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-gray-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors border border-gray-800">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:block">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
