import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Eye, CheckCircle, Clock, XCircle, ShieldAlert, CreditCard, Landmark, RefreshCw, Trash2 } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, registeredUsers, showToast } = useShop();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const formatPrice = (value: number) => {
    return value.toLocaleString('vi-VN') + ' đ';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const getUserName = (userId: string) => {
    const found = registeredUsers.find(u => u.id === userId);
    return found ? found.username : `ID: ${userId.slice(0, 8)}`;
  };

  const handleApprove = async (orderId: string) => {
    setApprovingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        showToast('Duyệt đơn hàng thành công!', 'success');
      } else {
        showToast(data.message || 'Lỗi khi duyệt đơn', 'error');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      showToast('Có lỗi xảy ra khi gọi API duyệt đơn!', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng không hợp lệ này không?')) return;
    setCancellingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        showToast('Đã hủy đơn hàng không hợp lệ thành công!', 'success');
      } else {
        showToast(data.message || 'Lỗi khi hủy đơn', 'error');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast('Có lỗi xảy ra khi gọi API hủy đơn!', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 bg-[#0a0a0a] border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-wide">
          <Clock className="w-5 h-5 text-red-600" /> Quản Lý Đơn Hàng Hệ Thống
        </h2>
        <span className="bg-red-950 text-red-400 text-xs px-3 py-1 rounded-full font-black border border-red-900/50">
          Tổng số: {orders.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-[#1a1a1aimg] bg-[#1a1a1a]/50 text-[10px] font-black uppercase text-gray-500 tracking-wider">
              <th className="p-4">Mã Đơn</th>
              <th className="p-4">Người mua</th>
              <th className="p-4">Dịch vụ</th>
              <th className="p-4">Trải nghiệm/Giá</th>
              <th className="p-4">Thanh toán</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-right">Xem/Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900 text-xs text-gray-300">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  Không có đơn hàng nào trong hệ thống.
                </td>
              </tr>
            ) : (
              [...orders]
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((order) => {
                  const isPending = order.status === 'PENDING';
                  return (
                    <tr 
                      key={order.id} 
                      className={`transition-colors hover:bg-gray-900/40 ${
                        isPending ? 'bg-red-950/10 font-bold border-l-4 border-l-red-600' : ''
                      }`}
                    >
                      <td className="p-4 font-mono font-black text-white">{order.id}</td>
                      <td className="p-4">
                        <div className="font-extrabold text-[#d22222]">{getUserName(order.userId)}</div>
                        {order.zaloPhone && (
                          <div className="text-[10px] text-green-400 mt-1 font-mono font-bold bg-green-950/20 px-1.5 py-0.5 rounded border border-green-900/10 w-fit">
                            Zalo: {order.zaloPhone}
                          </div>
                        )}
                      </td>
                      <td className="p-4 max-w-[200px] truncate">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="truncate">
                            {item.title} <span className="text-[10px] text-gray-500">({item.type})</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-extrabold text-white">{order.totalAmount ? formatPrice(order.totalAmount) : 'Miễn phí'}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-black p-1 px-2 rounded text-[10px] font-bold text-gray-400 border border-gray-800">
                          {order.paymentMethod === 'QR' ? <Landmark className="w-3 h-3 text-yellow-500" /> : <CreditCard className="w-3 h-3 text-blue-500" />}
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 font-mono">{formatDate(order.createdAt)}</td>
                      <td className="p-4 text-center">
                        {order.status === 'PENDING' ? (
                          <span className="inline-block bg-yellow-950/60 border border-yellow-700/50 text-yellow-500 font-black px-2 py-1 rounded text-[10px] uppercase animate-pulse">
                            Chờ duyệt
                          </span>
                        ) : order.status === 'SUCCESS' || order.status === 'COMPLETED' ? (
                          <span className="inline-block bg-green-950/60 border border-green-700/50 text-green-400 font-black px-2 py-1 rounded text-[10px] uppercase">
                            Hoàn thành
                          </span>
                        ) : order.status === 'CANCELLED' ? (
                          <span className="inline-block bg-red-950/60 border border-red-700/50 text-red-500 font-black px-2 py-1 rounded text-[10px] uppercase">
                            Đã Hủy
                          </span>
                        ) : (
                          <span className="inline-block bg-gray-950 border border-gray-800 text-gray-500 font-black px-2 py-1 rounded text-[10px] uppercase">
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 px-2.5 bg-gray-850 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded transition-all inline-flex items-center gap-1 font-bold text-[10px] uppercase cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> Chi tiết
                        </button>
                        
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleApprove(order.id)}
                              disabled={approvingId === order.id}
                              className="p-1 px-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-850 text-white font-extrabold rounded transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider shadow-md shadow-green-900/20 cursor-pointer"
                            >
                              {approvingId === order.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              Duyệt Đơn
                            </button>
                            <button
                              onClick={() => handleCancel(order.id)}
                              disabled={cancellingId === order.id}
                              className="p-1 px-2.5 bg-red-950/40 hover:bg-red-600 disabled:bg-gray-850 text-red-500 hover:text-white border border-red-950 hover:border-red-500 font-extrabold rounded transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider shadow-md shadow-red-950/20 cursor-pointer"
                              title="Hủy đơn hàng"
                            >
                              {cancellingId === order.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              Hủy Đơn
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-gray-855 border-gray-850 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-[#0a0a0a] border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                <Landmark className="w-4 h-4 text-red-500" /> Chi tiết đơn hàng: {selectedOrder.id}
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-gray-500 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-900 pb-4">
                <div>
                  <span className="text-gray-500 block mb-1">Tài khoản mua:</span>
                  <strong className="text-white text-sm">{getUserName(selectedOrder.userId)}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Phương thức:</span>
                  <strong className="text-white bg-[#1a1a1a] px-2 py-0.5 rounded font-mono border border-gray-800">{selectedOrder.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Tổng thanh toán:</span>
                  <strong className="text-red-500 text-sm font-black">{formatPrice(selectedOrder.totalAmount || 0)}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1 font-sans">Thời gian:</span>
                  <strong className="text-gray-300 font-mono">{formatDate(selectedOrder.createdAt)}</strong>
                </div>
                {selectedOrder.zaloPhone && (
                  <div className="col-span-2 bg-red-950/20 border border-red-900/40 p-3 rounded-xl flex flex-col gap-1 mt-1">
                    <span className="text-red-400 font-black uppercase tracking-wider text-[10px]">SĐT Zalo Nhận ID Phòng:</span>
                    <strong className="text-white text-sm font-mono">{selectedOrder.zaloPhone}</strong>
                  </div>
                )}
              </div>

              {/* Items display */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Danh Sách Vật Phẩm</h4>
                <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {selectedOrder.items.map((item: any, idx: number) => {
                    const credentialsExist = item.details?.gameUsername || item.gameUsername;
                    return (
                      <div key={idx} className="bg-black/40 border border-gray-900 p-3 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-200">{item.title}</span>
                          <span className="bg-gray-800 text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider text-gray-400">
                            {item.type}
                          </span>
                        </div>
                        {/* Credentials block */}
                        {credentialsExist && (
                          <div className="bg-[#1a1a1a] p-2.5 rounded-lg border border-red-950/50 space-y-1 text-[11px]">
                            <div className="flex justify-between font-mono">
                              <span className="text-gray-500 font-sans">Username:</span>
                              <strong className="text-white select-all font-bold">{item.details?.gameUsername || item.gameUsername}</strong>
                            </div>
                            <div className="flex justify-between font-mono">
                              <span className="text-gray-500 font-sans">Password:</span>
                              <strong className="text-red-400 select-all font-bold">{item.details?.gamePassword || item.gamePassword}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-900">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-all"
                >
                  Đóng
                </button>
                {selectedOrder.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        const id = selectedOrder.id;
                        setSelectedOrder(null);
                        await handleCancel(id);
                      }}
                      className="px-4 py-2 bg-red-950/40 hover:bg-red-600 text-red-500 hover:text-white border border-red-950 hover:border-red-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-1 shadow-md shadow-red-950/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hủy Đơn Hàng
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const id = selectedOrder.id;
                        setSelectedOrder(null);
                        await handleApprove(id);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-1 shadow-md shadow-green-900/30 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Duyệt Đơn Hàng
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
