import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Package, User, Clock, ArrowLeft, CheckCircle, RotateCcw, Eye, Copy, Save, Phone } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Order } from '../types';

export const Profile: React.FC = () => {
  const { user, orders, logout, showToast } = useShop();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [zaloPhone, setZaloPhone] = useState<string>('');

  // Auto-sync viewed order details in real-time
  useEffect(() => {
    if (selectedOrder) {
      const latest = orders.find(o => o.id === selectedOrder.id);
      if (latest) {
        setSelectedOrder(latest);
      }
    }
  }, [orders, selectedOrder?.id]);

  useEffect(() => {
    if (selectedOrder) {
      setZaloPhone(selectedOrder.zaloPhone || '');
    } else {
      setZaloPhone('');
    }
  }, [selectedOrder]);

  const handleSaveZalo = async () => {
    if (!selectedOrder) return;
    if (!zaloPhone.trim()) {
      showToast('Vui lòng nhập SĐT Zalo để nhận ID phòng!', 'error');
      return;
    }
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      const orderRef = doc(db, 'orders', selectedOrder.id);
      await updateDoc(orderRef, { zaloPhone: zaloPhone.trim() });
      setSelectedOrder(prev => prev ? { ...prev, zaloPhone: zaloPhone.trim() } : null);
      showToast('Cập nhật số điện thoại Zalo thành công!');
    } catch (err: any) {
      console.error('Lỗi khi lưu SĐT Zalo:', err);
      showToast('Có lỗi xảy ra khi lưu SĐT Zalo', 'error');
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label}!`);
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Vui lòng đăng nhập</h2>
        <button 
          onClick={() => navigate('/auth')}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition-colors"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);

  const handleLogout = () => {

    logout();
    navigate('/');
  };

  return (
    <div className="flex-1 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Trang cá nhân
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thông tin tài khoản */}
          <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 shadow-2xl h-fit">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-800">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border-2 border-red-600 mb-4">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase">{user.username}</h2>
              <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Vai trò: {user.role}</p>
            </div>
            
            <div className="pt-6 space-y-4">
              {user.email && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
                  <p className="text-gray-300 truncate">{user.email}</p>
                </div>
              )}
              {user.phone && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Số điện thoại</label>
                  <p className="text-gray-300 font-mono">{user.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Mật khẩu</label>
                <p className="text-gray-300">••••••••</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="mt-8 w-full bg-[#1f1f1f] hover:bg-red-900/30 text-red-500 border border-gray-800 hover:border-red-900 py-3 rounded-xl font-bold uppercase tracking-widest transition-colors"
            >
              Đăng xuất
            </button>
          </div>

          {/* Lịch sử đơn hàng */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2 mb-6">
              <Package className="w-6 h-6 text-red-600" />
              Lịch sử mua hàng
            </h2>

            {userOrders.length === 0 ? (
              <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Bạn chưa có đơn hàng nào.</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 text-red-500 hover:text-red-400 font-bold underline transition-colors"
                >
                  Mua sắm ngay
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map(order => (
                  <div key={order.id} className="bg-[#141414] border border-gray-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider text-xs">Mã ĐH: #{order.id.slice(0,8)}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded ${
                            order.status === 'COMPLETED' || order.status === 'SUCCESS' ? 'bg-green-900/40 text-green-500 border border-green-900' :
                            order.status === 'CANCELLED' ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                            'bg-yellow-900/40 text-yellow-500 border border-yellow-900'
                          }`}>
                            {(order.status === 'COMPLETED' || order.status === 'SUCCESS') && <CheckCircle className="w-3 h-3 inline mr-1" />}
                            {order.status === 'PENDING' && <RotateCcw className="w-3 h-3 inline mr-1" />}
                            {order.status === 'SUCCESS' ? 'SUCCESS' : order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl font-black text-red-500">{order.totalAmount.toLocaleString()}đ</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Thanh toán: {order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="text-gray-300 text-sm font-medium">{item.title}</span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {item.type === 'ACCOUNT' ? 'Acc Game' : item.type === 'SLOT' ? 'Thuê Slot' : 'Cày Thuê'}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm font-bold">{item.price.toLocaleString()}đ</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800 flex justify-end">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-red-600/10 hover:bg-red-600 active:scale-95 text-red-500 hover:text-white border border-red-950/40 hover:border-red-600 rounded-xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-gray-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-[#0a0a0a] border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                <Package className="w-5 h-5 text-red-600" /> Chi tiết đơn hàng: #{selectedOrder.id.slice(0, 8)}
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-gray-500 hover:text-white transition-colors text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            {/* Content info */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-800 pb-5">
                <div>
                  <span className="text-gray-500 block mb-1 uppercase tracking-wider font-bold">Ngày mua</span>
                  <strong className="text-gray-200 font-mono text-sm">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1 uppercase tracking-wider font-bold">Trạng thái</span>
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded ${
                    selectedOrder.status === 'COMPLETED' || selectedOrder.status === 'SUCCESS' ? 'bg-green-950/40 text-green-400 border border-green-900' :
                    selectedOrder.status === 'CANCELLED' ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                    'bg-yellow-950/40 text-yellow-500 border border-yellow-900'
                  }`}>
                    {selectedOrder.status === 'COMPLETED' || selectedOrder.status === 'SUCCESS' ? 'Hoàn thành' :
                     selectedOrder.status === 'CANCELLED' ? 'Đã hủy' : 'Chờ duyệt'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1 uppercase tracking-wider font-bold">Tổng thanh toán</span>
                  <strong className="text-red-500 text-base font-black">{selectedOrder.totalAmount.toLocaleString()}đ</strong>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1 uppercase tracking-wider font-bold">Phương thức</span>
                  <strong className="text-gray-300 bg-black/40 px-2 py-0.5 rounded font-mono border border-gray-800">{selectedOrder.paymentMethod}</strong>
                </div>
              </div>

              {/* Danh sách vật phẩm */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Danh Sách Vật Phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => {
                    const isAccount = item.type === 'ACCOUNT';
                    const isSlot = item.type === 'SLOT';
                    const isBoost = item.type === 'BOOST';
                    
                    const isOrderApproved = selectedOrder.status === 'SUCCESS' || selectedOrder.status === 'COMPLETED';
                    const credentialsExist = isOrderApproved && (item.details?.gameUsername || item.gameUsername || item.details?.gamePassword || item.gamePassword);

                    return (
                      <div key={idx} className="bg-black/30 border border-gray-800/80 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-900">
                          <span className="font-bold text-gray-100 text-sm">{item.title}</span>
                          <span className="bg-red-950/40 text-red-400 text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider border border-red-900/45">
                            {isAccount ? 'Acc Game' : isSlot ? 'Thuê Slot' : 'Cày Thuê'}
                          </span>
                        </div>

                        {/* Hướng dẫn chi tiết / thông tin tài khoản */}
                        {isAccount && (
                          <div className="space-y-3">
                            <div className="bg-red-950/40 border border-red-500/50 p-3.5 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.2)] text-center relative overflow-hidden">
                               <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10" />
                               <p className="text-white text-xs font-bold leading-relaxed relative z-10">
                                 ĐỂ ĐỔI MẬT KHẨU, SỐ ĐIỆN THOẠI, GMAIL TRONG ACC BẠN VỪA MUA.<br />
                                 HÃY LIÊN HỆ SĐT ZALO CỦA ADMIN ĐỂ ĐƯỢC HỖ TRỢ: <br/>
                                 <span className="text-yellow-400 text-sm font-black mt-2 inline-block px-3 py-1 bg-black/40 rounded border border-yellow-900/50">0938587108</span>
                               </p>
                            </div>

                            {credentialsExist ? (
                              <div className="space-y-2">
                                <p className="text-[11px] text-green-400 font-medium">🎉 Đã có thông tin đăng nhập! Bạn hãy sao chép tài khoản và mật khẩu dưới đây để đăng nhập vào game:</p>
                                <div className="bg-[#1c1c1c] p-3 rounded-lg border border-green-900/30 space-y-2 text-xs">
                                  <div className="flex justify-between items-center font-mono">
                                    <span className="text-gray-500">Tài khoản:</span>
                                    <div className="flex items-center gap-1.5">
                                      <strong className="text-white select-all">{item.details?.gameUsername || item.gameUsername || 'kirito_pro'}</strong>
                                      <button 
                                        onClick={() => handleCopy(item.details?.gameUsername || item.gameUsername || 'kirito_pro', 'tài khoản')}
                                        className="text-gray-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                                        title="Sao chép"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center font-mono">
                                    <span className="text-gray-500">Mật khẩu:</span>
                                    <div className="flex items-center gap-1.5">
                                      <strong className="text-red-400 select-all">{item.details?.gamePassword || item.gamePassword || 'Lq_pass_9988'}</strong>
                                      <button 
                                        onClick={() => handleCopy(item.details?.gamePassword || item.gamePassword || 'Lq_pass_9988', 'mật khẩu')}
                                        className="text-gray-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                                        title="Sao chép"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : selectedOrder.status === 'CANCELLED' ? (
                              <p className="text-xs text-red-500">Đơn hàng này đã bị hủy. Vui lòng liên hệ Admin.</p>
                            ) : (
                              <p className="text-xs text-yellow-500 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 animate-pulse" /> Đang chờ duyệt đơn. Tài khoản & mật khẩu sẽ cấp ngay khi Admin phê duyệt!
                              </p>
                            )}
                          </div>
                        )}

                        {isSlot && (
                          <div className="space-y-3">
                            <div className="text-xs text-gray-400 space-y-1.5 bg-black/40 p-3 rounded-lg border border-gray-900">
                              <p className="font-bold text-gray-300">🎮 Quy trình tham gia Slot chơi cùng:</p>
                              <ul className="list-disc pl-4 space-y-1 text-gray-400">
                                <li>Admin sẽ tiếp nhận đơn đặt chơi cùng của bạn.</li>
                                <li>ID phòng chơi cùng sẽ được gửi trực tiếp đến bạn qua số điện thoại Zalo cung cấp ở dưới.</li>
                                <li>Hành động cài vô slot: Hãy chuẩn bị sẵn game, Admin sẽ kéo chat và setup room nhanh chóng nhất!</li>
                              </ul>
                              <div className="mt-2.5 pt-2 border-t border-gray-800/60 flex items-center justify-between text-[11px]">
                                <span className="text-gray-400 flex items-center gap-1">
                                  💬 <strong>Zalo Admin hỗ trợ:</strong>
                                </span>
                                <div className="flex items-center gap-1.5 text-white bg-black/50 px-2.5 py-1 rounded-md border border-gray-800 font-mono font-bold">
                                  <span>0938587108</span>
                                  <button
                                    onClick={() => handleCopy('0938587108', 'SĐT Zalo Admin')}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5"
                                    title="Sao chép SĐT Zalo Admin"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Ô CHỮ NỔI BẬT: INPUT SĐT ZALO */}
                            <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl text-center space-y-3">
                              <p className="text-red-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-red-500 animate-bounce" /> Hành động cần thiết:
                              </p>
                              <p className="text-xs text-gray-200 font-bold leading-relaxed">
                                Hãy nhập SĐT Zalo để có thể nhận được ID phòng chơi cùng
                              </p>
                              <div className="flex gap-2 max-w-sm mx-auto">
                                <input 
                                  type="text" 
                                  value={zaloPhone} 
                                  onChange={(e) => setZaloPhone(e.target.value)}
                                  placeholder="Nhập SĐT Zalo của bạn..."
                                  className="bg-[#0e0e0e] border border-gray-800 focus:border-red-600 rounded-xl px-3 py-2 text-xs text-white grow outline-none placeholder-gray-600 transition-colors"
                                />
                                <button 
                                  onClick={handleSaveZalo}
                                  className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-lg shadow-red-900/10"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  Lưu
                                </button>
                              </div>
                              {selectedOrder.zaloPhone && (
                                <p className="text-[10px] text-green-400 font-mono flex items-center justify-center gap-1 bg-green-950/20 py-1.5 rounded border border-green-900/20">
                                  ✓ Đã cập nhật SĐT Zalo nhận ID: <strong className="text-white font-sans">{selectedOrder.zaloPhone}</strong>
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {isBoost && (
                          <div className="text-xs text-gray-400 space-y-1.5 bg-black/40 p-3 rounded-lg border border-gray-900">
                            <p className="font-bold text-gray-300">🛡️ Quy trình Cày Thuê Rank:</p>
                            <p>Đơn hàng cày thuê đang được điều phối. Tuyển thủ của shop sẽ liên hệ qua SĐT hoặc Zalo đăng ký để nhận thông tin mật khẩu tài khoản và bắt đầu cày siêu tốc!</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#0a0a0a] border-t border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
