import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, CreditCard, Smartphone, CheckCircle, ArrowRight, Copy, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, placeOrder, user, showToast, clearCart } = useShop();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'QR' | 'CARD'>('QR');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để thanh toán', 'error');
      navigate('/auth');
      return;
    }
    const randomId = 'DH' + Math.floor(10000 + Math.random() * 90000);
    setOrderId(randomId);
    setIsCancelled(false);
    setShowCheckout(true);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (paymentMethod === 'QR') {
      setIsVerifying(true);
      try {
        const response = await fetch(`/api/orders/${orderId}/paid`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            items: cart,
            totalAmount: total,
            paymentMethod: 'QR'
          })
        });
        const data = await response.json();
        if (!data.success) {
          showToast(data.error || 'Có lỗi xảy ra', 'error');
          setIsVerifying(false);
          return;
        }

        // Set up real-time status checking from Firestore
        const orderRef = doc(db, 'orders', orderId);
        const unsub = onSnapshot(orderRef, (docSnap) => {
          if (docSnap.exists()) {
            const ordData = docSnap.data();
            if (ordData.status === 'SUCCESS' || ordData.status === 'COMPLETED') {
              unsub();
              clearCart();
              setIsVerifying(false);
              setIsSuccess(true);
              setIsCancelled(false);
              showToast('Giao dịch đã được duyệt thành công!', 'success');
              setTimeout(() => {
                setIsSuccess(false);
                setShowCheckout(false);
                navigate('/profile');
              }, 3000);
            } else if (ordData.status === 'CANCELLED') {
              unsub();
              setIsVerifying(false);
              setIsCancelled(true);
              showToast('Đơn hàng đã bị hủy và sẽ được hoàn tiền', 'error');
            }
          }
        });
      } catch (err) {
        console.error(err);
        showToast('Có lỗi xảy ra khi gửi yêu cầu chuyển khoản!', 'error');
        setIsVerifying(false);
      }
    } else {
      const isPlaced = await placeOrder(paymentMethod, orderId);
      if (isPlaced) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setShowCheckout(false);
          navigate('/profile');
        }, 2000);
      }
    }
  };

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showToast(message, 'success');
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
                 <p className="text-gray-400 text-sm">Cảm ơn bạn! Hệ thống/Tài khoản game đang sẵn sàng cho bạn trải nghiệm.</p>
               </div>
            ) : isCancelled ? (
               <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                 <XCircle className="w-20 h-20 text-red-500 mb-2 animate-pulse" />
                 <h3 className="text-2xl font-black text-white uppercase tracking-wider">Đơn hàng bị hủy</h3>
                 <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-4.5 rounded-xl leading-relaxed max-w-xs mx-auto text-center font-bold">
                   đơn hàng đã bị huỷ và tiền bạn đã chuyển sẽ được chuyển lại
                 </div>
                 <button
                   onClick={() => {
                     setIsCancelled(false);
                     setShowCheckout(false);
                   }}
                   className="mt-4 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                 >
                   Quay lại giỏ hàng
                 </button>
               </div>
            ) : isVerifying ? (
               <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                 <div className="relative">
                   <div className="w-16 h-16 border-4 border-red-950 border-t-red-600 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-red-500 text-[9px] uppercase animate-pulse">Duyệt</div>
                 </div>
                 <h3 className="text-base font-black text-white uppercase tracking-wider">Xác nhận chuyển khoản</h3>
                 <div className="text-xs text-gray-400 bg-red-950/20 border border-red-900/10 p-3.5 rounded-xl leading-relaxed max-w-xs mx-auto text-left">
                   <p className="font-extrabold text-[#d22222] mb-1">Đang chờ Admin duyệt đơn... Vui lòng không tắt trang này.</p>
                   Hệ thống đang kiểm tra tự động mã đơn hàng <strong className="text-white font-mono">{orderId}</strong>. Bạn hãy giữ nguyên màn hình để nhận tài khoản game ngay khi được kích hoạt.
                 </div>
               </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-800 bg-[#1f1f1f] flex justify-between items-center">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">Thanh Toán Đơn Hàng</h3>
                  <button onClick={() => { setShowCheckout(false); setIsVerifying(false); }} className="text-gray-500 hover:text-white">✕</button>
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
                      <div className="space-y-4 bg-[#0a0a0a] p-5 rounded-xl border border-gray-800">
                        <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Mã đơn hàng: <span className="text-white font-mono">{orderId}</span>
                        </div>
                        
                        <div className="flex justify-center">
                          <img 
                            src={`https://img.vietqr.io/image/970441-222082008-compact2.jpg?amount=${total}&addInfo=THANH%20TOAN%20DON%20HANG%20${orderId}&accountName=MAI%20NAM%20ANH`}
                            alt="VietQR Code" 
                            className="w-48 h-48 rounded-lg border border-gray-800 bg-white p-2 shadow-inner"
                          />
                        </div>

                        <div className="text-xs text-gray-300 space-y-2 border-t border-gray-800 pt-4">
                          <div className="flex justify-between items-center py-1 border-b border-gray-900">
                            <span className="text-gray-500 uppercase tracking-wider font-extrabold text-[10px]">Ngân hàng</span>
                            <span className="text-white font-black">VIB</span>
                          </div>
                          
                          <div className="flex justify-between items-center py-1 border-b border-gray-900">
                            <span className="text-gray-500 uppercase tracking-wider font-extrabold text-[10px]">Chủ tài khoản</span>
                            <span className="text-white font-extrabold uppercase">MAI NAM ANH</span>
                          </div>
                          
                          <div className="flex justify-between items-center py-1 border-b border-gray-900">
                            <span className="text-gray-500 uppercase tracking-wider font-extrabold text-[10px]">Số tài khoản</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono font-black text-sm">222082008</span>
                              <button 
                                type="button" 
                                onClick={() => handleCopy('222082008', 'Đã sao chép số tài khoản!')}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded transition-all"
                                title="Copy số tài khoản"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-1 border-b border-gray-900">
                            <span className="text-gray-500 uppercase tracking-wider font-extrabold text-[10px]">Số tiền đơn hàng</span>
                            <span className="text-red-500 font-black text-sm">{total.toLocaleString()} đ</span>
                          </div>
                          
                          <div className="flex flex-col gap-1 py-1">
                            <div className="flex justify-between items-center font-extrabold">
                              <span className="text-gray-500 uppercase tracking-wider text-[10px]">Nội dung chuyển khoản</span>
                              <button 
                                type="button" 
                                onClick={() => handleCopy(`THANH TOAN DON HANG ${orderId}`, 'Đã sao chép nội dung chuyển khoản!')}
                                className="flex items-center gap-1 text-[10px] bg-red-950/40 text-red-400 hover:text-red-300 border border-red-900/40 px-2 py-0.5 rounded transition-all"
                              >
                                <Copy className="w-2.5 h-2.5" /> Copy nhanh
                              </button>
                            </div>
                            <div className="bg-black p-2 rounded border border-gray-900 text-center font-mono font-black text-white uppercase text-xs tracking-wide">
                              THANH TOAN DON HANG {orderId}
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-[11px] text-gray-400 leading-relaxed text-center">
                          <strong className="text-red-500">Lưu ý:</strong> Vui lòng quét mã QR hoặc chuyển khoản đúng số tiền và nội dung phía trên để hệ thống duyệt đơn tự động.
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
                      <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-red-900/30">
                        {paymentMethod === 'QR' ? 'Tôi Đã Chuyển Khoản Thành Công' : 'Xác Nhận Đã Thanh Toán'}
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
