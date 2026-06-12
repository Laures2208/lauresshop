import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, CreditCard, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, user } = useShop();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'QR' | 'CARD'>('QR');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thanh toán');
      navigate('/auth');
      return;
    }
    setShowCheckout(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        setIsSuccess(false);
        setShowCheckout(false);
        navigate('/');
      }, 2000);
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-black flex flex-col items-center justify-center p-4">
        <div className="text-gray-500 mb-4">
          <Trash2 className="w-16 h-16 mx-auto opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-400 mb-6">Bạn chưa chọn dịch vụ nào.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-medium transition-colors"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black text-white uppercase border-l-4 border-red-600 pl-3 mb-8 tracking-tighter">
          Giỏ Hàng Của Bạn
        </h1>

        <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-800 bg-[#1f1f1f] text-xs font-black text-gray-400 uppercase tracking-widest">
            <div className="col-span-6">Dịch vụ</div>
            <div className="col-span-3 text-right">Phân loại</div>
            <div className="col-span-2 text-right">Đơn giá</div>
            <div className="col-span-1 text-center">Xóa</div>
          </div>
          
          <div className="divide-y divide-gray-800">
            {cart.map((item) => (
              <div key={item.id} className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-6 flex flex-col">
                  <span className="font-semibold text-gray-200">{item.title}</span>
                  {item.type === 'SLOT' && <span className="text-xs text-gray-500 mt-1">Số lượng: {item.details?.hours} giờ</span>}
                  {item.type === 'BOOST' && <span className="text-xs text-gray-500 mt-1">Chi tiết: {item.details?.boostType}</span>}
                </div>
                
                <div className="sm:col-span-3 text-left sm:text-right">
                  <span className="inline-block bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700">
                    {item.type === 'ACCOUNT' ? 'Acc Game' : item.type === 'SLOT' ? 'Thuê Slot' : 'Cày Thuê'}
                  </span>
                </div>

                <div className="sm:col-span-2 text-left sm:text-right font-bold text-red-500">
                  {item.price.toLocaleString()}đ
                </div>

                <div className="sm:col-span-1 text-left sm:text-center mt-2 sm:mt-0">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-500 p-2 transition-colors"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 className="w-5 h-5 inline-block sm:block sm:mx-auto" /> 
                    <span className="sm:hidden ml-2 text-sm">Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#1f1f1f] border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm font-bold uppercase">
              Tổng số lượng <span className="text-white bg-gray-800 px-2 py-0.5 rounded ml-2">{cart.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 font-black uppercase text-xs tracking-widest">Tổng thanh toán:</span>
              <span className="text-3xl font-black text-red-600 drop-shadow-md">{total.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleCheckout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/30"
          >
            Tiến Hành Thanh Toán <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {isSuccess ? (
               <div className="p-8 text-center flex flex-col items-center">
                 <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                 <h3 className="text-2xl font-black text-white mb-2 uppercase">Thanh toán thành công!</h3>
                 <p className="text-gray-400 text-sm">Hệ thống đang xử lý đơn hàng của bạn.</p>
               </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-800 bg-[#1f1f1f] flex justify-between items-center">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">Thanh Toán Đơn Hàng</h3>
                  <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                      onClick={() => setPaymentMethod('QR')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'QR' ? 'border-red-600 bg-red-900/20 text-white' : 'border-gray-800 bg-[#0a0a0a] text-gray-400 hover:border-gray-600 hover:bg-[#1f1f1f]'
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-wide">Chuyển Khoản QR</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'CARD' ? 'border-red-600 bg-red-900/20 text-white' : 'border-gray-800 bg-[#0a0a0a] text-gray-400 hover:border-gray-600 hover:bg-[#1f1f1f]'
                      }`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="text-xs font-black uppercase tracking-wide">Thẻ Cào</span>
                    </button>
                  </div>

                  <form onSubmit={handleConfirmPayment}>
                    {paymentMethod === 'QR' ? (
                      <div className="space-y-4 text-center bg-[#0a0a0a] p-6 rounded-xl border border-gray-800">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LQSHOP_${user?.username}_${total}&color=dc2626&bgcolor=111111`}
                          alt="QR Code" 
                          className="w-40 h-40 mx-auto rounded border border-gray-700 bg-white p-2"
                        />
                        <div className="text-sm text-gray-300">
                          <p>Ngân hàng: <strong className="text-white">MB Bank</strong></p>
                          <p>STK: <strong className="text-white font-mono">1234567890</strong></p>
                          <p>Chủ TK: <strong className="text-white uppercase">LQ SHOP VN</strong></p>
                          <p>Số tiền: <strong className="text-red-500 font-bold">{total.toLocaleString()}đ</strong></p>
                          <p className="mt-2 text-xs text-gray-500 bg-black p-2 rounded">Nội dung CK: <span className="font-mono text-gray-300">LQSHOP {user?.username}</span></p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Mã Seri</label>
                          <input type="text" required className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="Số Seri thẻ..." />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Mã Thẻ (PIN)</label>
                          <input type="text" required className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="Mã thẻ bí mật..." />
                        </div>
                         <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 text-xs text-gray-300">
                           <p><strong>Lưu ý:</strong> Vui lòng chọn mệnh giá thẻ bằng hoặc cao hơn giá trị đơn hàng <span className="text-red-500 font-black tracking-wider">({total.toLocaleString()}đ)</span>.</p>
                         </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-colors shadow-lg shadow-red-900/30">
                        Xác Nhận Đã Thanh Toán
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
