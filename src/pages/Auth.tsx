import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router';
import { Lock, User, Mail, Phone } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { login, registerUser, showToast } = useShop();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    if (isLogin) {
      if (login(username, password)) {
        navigate(username === 'Laures2208' ? '/admin' : '/');
      } else {
        showToast("Tài khoản hoặc mật khẩu không đúng.", 'error');
      }
    } else {
      if (!agreeTerms) {
        showToast("Bạn cần đồng ý với điều khoản sử dụng.", 'error');
        return;
      }
      const success = await registerUser({ username, email, phone, password });
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-[#141414] border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 hidden sm:block">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-xl mx-auto mb-4 flex items-center justify-center font-black text-3xl italic tracking-tighter text-white">
            LQ
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">
            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </h2>
          <p className="text-gray-400 text-xs tracking-wide uppercase mt-2">Tham gia cộng đồng LQ SHOP lớn nhất Việt Nam</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-800 rounded-xl leading-5 bg-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-red-600 sm:text-sm transition-colors"
                placeholder="Nhập tên tài khoản..."
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-800 rounded-xl leading-5 bg-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-red-600 sm:text-sm transition-colors"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Số điện thoại</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-800 rounded-xl leading-5 bg-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-red-600 sm:text-sm transition-colors"
                    placeholder="0912345678"
                  />
                </div>
              </div>
            </>
          )}

          <div>
             <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-800 rounded-xl leading-5 bg-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-red-600 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
             <div className="flex items-start">
              <input
                id="terms-checkbox"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-red-600 bg-[#1f1f1f] border-gray-800 rounded focus:ring-red-500 focus:ring-offset-[#141414]"
              />
              <label htmlFor="terms-checkbox" className="ml-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                Tôi đồng ý sử dụng thông tin đã nhập để đăng ký tài khoản và các điều khoản dịch vụ.
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/30"
          >
            {isLogin ? 'Đăng Nhập Ngay' : 'Xác Nhận Đăng Ký'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-red-500 hover:text-red-400 ml-1 transition-colors underline"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>

       {/* Mobile View */}
       <div className="bg-[#141414] border border-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md sm:hidden">
          <h2 className="text-2xl font-black text-white uppercase text-center mb-6 tracking-widest">{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
           <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-red-600"
                placeholder="Tên đăng nhập"
              />
              
              {!isLogin && (
                <>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-red-600"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-red-600"
                    placeholder="Số điện thoại"
                  />
                </>
              )}

               <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-red-600"
                placeholder="Mật khẩu"
              />

              {!isLogin && (
                <label className="flex items-start text-[10px] font-bold uppercase tracking-wide text-gray-400 pt-2">
                  <input type="checkbox" required checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mr-2 mt-0.5 border-gray-800 bg-[#1f1f1f]"/>
                  Tôi đồng ý sử dụng thông tin đã nhập để đăng ký.
                </label>
              )}

               <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-widest mt-4 shadow-lg shadow-red-900/30"
              >
                {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
              </button>
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)} 
                className="w-full text-gray-400 hover:text-white py-4 text-xs font-bold uppercase tracking-widest"
              >
                {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
              </button>
           </form>
       </div>
    </div>
  );
};
