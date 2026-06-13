import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router';
import { ShieldCheck, PlusCircle, Image as ImageIcon, Users, Settings, Edit, Trash2 } from 'lucide-react';
import { User } from '../types';
import { AdminOrders } from '../components/AdminOrders';

export const Admin: React.FC = () => {
  const { user, addAccount, registeredUsers, servicePrices, updateServicePrices, showToast, deleteUser, updateUser, orders } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ACCOUNTS' | 'USERS' | 'SETTINGS' | 'ORDERS'>('ACCOUNTS');

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    price: '',
    originalPrice: '',
    discountPercentage: '',
    rank: 'Cao Thủ',
    champions: '',
    skins: '',
    gameUsername: '',
    gamePassword: ''
  });

  const [pricesData, setPricesData] = useState({
    rentPerHour: servicePrices.rentPerHour.toString(),
    boostBasic: servicePrices.boostBasic.toString(),
    boostStar: servicePrices.boostStar.toString(),
    boostCombo1: servicePrices.boostCombo1.toString(),
    boostCombo2: servicePrices.boostCombo2.toString(),
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<User>>({});

  if (!user || user.role !== 'ADMIN') {
    return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-red-900/50 p-8 rounded-2xl max-w-md text-center shadow-2xl">
        <ShieldCheck className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Khu Vực Cấm</h2>
        <p className="text-gray-400 mb-6 text-sm tracking-wide">Bạn không có quyền truy cập trang quản trị này.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#1f1f1f] hover:bg-[#252525] border border-gray-800 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPricesData({ ...pricesData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl || !formData.price || !formData.gameUsername || !formData.gamePassword) return;

    addAccount({
      title: formData.title,
      imageUrl: formData.imageUrl,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      discountPercentage: formData.discountPercentage ? parseInt(formData.discountPercentage) : undefined,
      rank: formData.rank,
      champions: formData.champions ? parseInt(formData.champions) : undefined,
      skins: formData.skins ? parseInt(formData.skins) : undefined,
      gameUsername: formData.gameUsername,
      gamePassword: formData.gamePassword,
    });

    showToast('Đăng sản phẩm thành công!');
    setFormData({
      title: '', imageUrl: '', price: '', originalPrice: '', discountPercentage: '', rank: 'Cao Thủ', champions: '', skins: '', gameUsername: '', gamePassword: ''
    });
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updateServicePrices({
      rentPerHour: parseInt(pricesData.rentPerHour) || 0,
      boostBasic: parseInt(pricesData.boostBasic) || 0,
      boostStar: parseInt(pricesData.boostStar) || 0,
      boostCombo1: parseInt(pricesData.boostCombo1) || 0,
      boostCombo2: parseInt(pricesData.boostCombo2) || 0,
    });
    showToast('Cập nhật bảng giá thành công!');
  };

  return (
    <div className="flex-1 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Quản Trị Hệ Thống</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('ACCOUNTS')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${activeTab === 'ACCOUNTS' ? 'bg-red-600 text-white' : 'bg-[#1f1f1f] text-gray-400 hover:text-white'}`}>Tài Khoản Game</button>
            <button onClick={() => setActiveTab('SETTINGS')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${activeTab === 'SETTINGS' ? 'bg-red-600 text-white' : 'bg-[#1f1f1f] text-gray-400 hover:text-white'}`}>Cấu Hình Giá</button>
            <button onClick={() => setActiveTab('USERS')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${activeTab === 'USERS' ? 'bg-red-600 text-white' : 'bg-[#1f1f1f] text-gray-400 hover:text-white'}`}>Khách Hàng</button>
            <button onClick={() => setActiveTab('ORDERS')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${activeTab === 'ORDERS' ? 'bg-red-600 text-white' : 'bg-[#1f1f1f] text-gray-400 hover:text-white'}`}>Đơn Hàng</button>
          </div>
        </div>

        {activeTab === 'ACCOUNTS' && (
          <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#0a0a0a] border-b border-gray-800">
              <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <PlusCircle className="w-5 h-5 text-red-600" /> Thêm Tài Khoản Mới
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Tiêu đề / Tên gói</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ví dụ: Acc Trắng Thông Tin Vip..."
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                   <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">URL Hình Ảnh</label>
                   <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-800 bg-[#0a0a0a] text-gray-500">
                        <ImageIcon className="w-4 h-4" />
                      </span>
                      <input 
                        type="url" 
                        name="imageUrl"
                        required
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="flex-1 w-full bg-[#1f1f1f] border border-gray-800 rounded-none rounded-r-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors"
                      />
                   </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Giá bán (VNĐ)</label>
                  <input 
                    type="number" 
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div>
                   <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Giảm giá (%) <span className="text-gray-600 font-normal normal-case tracking-normal">Tùy chọn</span></label>
                  <input 
                    type="number" 
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                 <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Mức Rank</label>
                  <select 
                    name="rank"
                    value={formData.rank}
                    onChange={handleChange}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="Đồng">Đồng</option>
                    <option value="Bạc">Bạc</option>
                    <option value="Vàng">Vàng</option>
                    <option value="Bạch Kim">Bạch Kim</option>
                    <option value="Kim Cương">Kim Cương</option>
                    <option value="Tinh Anh">Tinh Anh</option>
                    <option value="Cao Thủ">Cao Thủ</option>
                    <option value="Chiến Tướng">Chiến Tướng</option>
                  </select>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Số Tướng</label>
                      <input 
                        type="number" 
                        name="champions"
                        value={formData.champions}
                        onChange={handleChange}
                        className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Số Trang Phục</label>
                      <input 
                        type="number" 
                        name="skins"
                        value={formData.skins}
                        onChange={handleChange}
                        className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                 </div>
                 
                 <div className="md:col-span-2 pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4">Thông tin đăng nhập Game</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Tài khoản Game</label>
                        <input 
                          type="text" 
                          name="gameUsername"
                          required
                          value={formData.gameUsername}
                          onChange={handleChange}
                          className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Mật khẩu Game</label>
                        <input 
                          type="text" 
                          name="gamePassword"
                          required
                          value={formData.gamePassword}
                          onChange={handleChange}
                          className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-gray-800">
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/30"
                >
                  Đăng Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#0a0a0a] border-b border-gray-800">
              <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <Settings className="w-5 h-5 text-red-600" /> Thiết Lập Giá Dịch Vụ
              </h2>
            </div>
            <form onSubmit={handleSavePrices} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Thuê Slot (VNĐ / Giờ)</label>
                  <input 
                    type="number" 
                    name="rentPerHour"
                    required
                    value={pricesData.rentPerHour}
                    onChange={handlePriceChange}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Cày Cơ Bản Lên Cao Thủ (VNĐ)</label>
                  <input 
                    type="number" 
                    name="boostBasic"
                    required
                    value={pricesData.boostBasic}
                    onChange={handlePriceChange}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Cày Sao Cao Thủ (VNĐ / Sao)</label>
                  <input 
                    type="number" 
                    name="boostStar"
                    required
                    value={pricesData.boostStar}
                    onChange={handlePriceChange}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Combo Đồng → Chiến Tướng (VNĐ)</label>
                  <input 
                    type="number" 
                    name="boostCombo1"
                    required
                    value={pricesData.boostCombo1}
                    onChange={handlePriceChange}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Combo Cao Thủ → Chiến Tướng (VNĐ)</label>
                  <input 
                    type="number" 
                    name="boostCombo2"
                    required
                    value={pricesData.boostCombo2}
                    onChange={handlePriceChange}
                    className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-800">
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all">Lưu Bảng Giá</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'USERS' && !editingUser && (
          <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#0a0a0a] border-b border-gray-800">
              <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <Users className="w-5 h-5 text-red-600" /> Danh Sách Khách Hàng
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1f1f1f] text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-800">
                    <th className="p-4">ID</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">SĐT</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có khách hàng nào đăng ký.</td>
                    </tr>
                  ) : (
                    registeredUsers.map(u => (
                      <tr key={u.id} className="border-b border-gray-800 hover:bg-[#0a0a0a] transition-colors text-sm">
                        <td className="p-4 font-mono text-gray-500 text-xs">{u.id.substring(0, 8)}</td>
                        <td className="p-4 font-bold text-white">{u.username}</td>
                        <td className="p-4 text-gray-400">{u.email || 'N/A'}</td>
                        <td className="p-4 text-gray-400">{u.phone || 'N/A'}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => {
                              setEditingUser(u);
                              setUserFormData(u);
                            }}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Bạn muốn xoá tài khoản ${u.username}?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-2 text-red-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'USERS' && editingUser && (
          <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#0a0a0a] border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <Settings className="w-5 h-5 text-red-600" /> Cập nhật người dùng: {editingUser.username}
              </h2>
              <button 
                onClick={() => { setEditingUser(null); setUserFormData({}); }}
                className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest"
              >
                Quay Lại
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await updateUser(editingUser.id, userFormData);
                    setEditingUser({ ...editingUser, ...userFormData });
                  }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4">Thông Tin Chọn Lọc</h3>
                  
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Username</label>
                    <input 
                      type="text" 
                      value={userFormData.username || ''}
                      onChange={(e) => setUserFormData({...userFormData, username: e.target.value})}
                      className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Mật Khẩu</label>
                    <input 
                      type="text" 
                      value={userFormData.password || ''}
                      onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                      className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Email</label>
                    <input 
                      type="email" 
                      value={userFormData.email || ''}
                      onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                      className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Số Điện Thoại</label>
                    <input 
                      type="text" 
                      value={userFormData.phone || ''}
                      onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                      className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2 tracking-widest">Số Dư (VNĐ)</label>
                    <input 
                      type="number" 
                      value={userFormData.balance || 0}
                      onChange={(e) => setUserFormData({...userFormData, balance: parseInt(e.target.value) || 0})}
                      className="w-full bg-[#1f1f1f] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all">Lưu Thông Tin</button>
                  </div>
                </form>
              </div>

              <div>
                <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4">Lịch Sử Mua Hàng</h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {orders.filter(o => o.userId === editingUser.id).length === 0 ? (
                    <p className="text-gray-500 italic">Chưa có đơn hàng nào.</p>
                  ) : (
                    orders.filter(o => o.userId === editingUser.id).map(order => (
                      <div key={order.id} className="bg-[#1f1f1f] border border-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-gray-400 uppercase">Mã: #{order.id.slice(0, 8)}</span>
                          <span className="text-xs font-black text-red-500">{order.totalAmount.toLocaleString()}đ</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                        <ul className="space-y-2">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-xs border-t border-gray-800 pt-2">
                              <span className="text-white">{item.title}</span>
                              <span className="text-gray-400">{item.price.toLocaleString()}đ</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ORDERS' && (
          <AdminOrders />
        )}
      </div>
    </div>
  );
};
