import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Trash2, Settings2, Eye, EyeOff, Save, Code, Loader2, ShoppingCart, Clock, Minus, Plus } from 'lucide-react';
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

type Combo = {
  id: string;
  name: string;
  price: string;
};

type StylesConfig = {
  fontStyle: string;
  bgColor: string;
  borderColor: string;
  borderWidth: string;
  rounded: string;
  glow: boolean;
  animation: string;
};

type QuantityConfig = {
  isEnable: boolean;
  label: string;
  unitPrice: string;
  buttonText: string;
};

type ServiceConfig = {
  isVisible: boolean;
  title: string;
  combos: Combo[];
  styles: StylesConfig;
  quantityConfig: QuantityConfig;
};

type FirebaseService = ServiceConfig & { id: string };

export const ServiceManager: React.FC = () => {
  const [config, setConfig] = useState<ServiceConfig>({
    isVisible: true,
    title: 'Dịch Vụ Mới',
    combos: [
      { id: Date.now().toString(), name: 'Combo Cơ Bản', price: '100000' }
    ],
    styles: {
      fontStyle: 'bold',
      bgColor: '#141414',
      borderColor: '#dc2626',
      borderWidth: '2px',
      rounded: 'xl',
      glow: true,
      animation: 'pulse',
    },
    quantityConfig: {
      isEnable: false,
      label: 'SỐ GIỜ MUỐN THUÊ',
      unitPrice: '8000',
      buttonText: 'ĐĂNG KÝ THUÊ'
    }
  });

  const [showJson, setShowJson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<FirebaseService[]>([]);
  const [previewQuantity, setPreviewQuantity] = useState(1);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'custom_services'));
      const servicesData: FirebaseService[] = [];
      querySnapshot.forEach((doc) => {
        servicesData.push({ id: doc.id, ...doc.data() } as FirebaseService);
      });
      setServices(servicesData);
    } catch (error) {
      console.error('Lỗi tải danh sách dịch vụ:', error);
    }
  };

  const handleSaveService = async () => {
    try {
      setSaving(true);
      await addDoc(collection(db, 'custom_services'), {
        ...config,
        createdAt: serverTimestamp()
      });
      alert('Lưu dịch vụ thành công!');
      fetchServices(); // Refresh list after saving
    } catch (error: any) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      alert('Lỗi khi lưu dịch vụ: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'custom_services', id), { isVisible: !currentStatus });
      setServices(prev => prev.map(s => s.id === id ? { ...s, isVisible: !currentStatus } : s));
    } catch (error) {
      console.error('Lỗi cập nhật hiển thị:', error);
      alert('Không thể cập nhật trạng thái hiển thị.');
    }
  };

  const handleConfigChange = (key: keyof ServiceConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleStyleChange = (key: keyof StylesConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      styles: { ...prev.styles, [key]: value }
    }));
  };

  const handleQuantityConfigChange = (key: keyof QuantityConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      quantityConfig: { ...prev.quantityConfig, [key]: value }
    }));
  };

  const addCombo = () => {
    setConfig((prev) => ({
      ...prev,
      combos: [...prev.combos, { id: Date.now().toString(), name: '', price: '' }]
    }));
  };

  const removeCombo = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      combos: prev.combos.filter(c => c.id !== id)
    }));
  };

  const updateCombo = (id: string, field: keyof Combo, value: string) => {
    setConfig((prev) => ({
      ...prev,
      combos: prev.combos.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  // Animation variants
  const getAnimationProps = () => {
    const { animation } = config.styles;
    if (!config.isVisible) return {};

    switch (animation) {
      case 'pulse':
        return {
          animate: { scale: [1, 1.02, 1] },
          transition: { repeat: Infinity, duration: 2 }
        };
      case 'float':
        return {
          animate: { y: [0, -10, 0] },
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        };
      case 'shake':
        return {
          whileHover: { rotate: [-1, 1, -1, 1, 0] },
          transition: { duration: 0.4 }
        };
      default:
        return {};
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* LEFT: Control Panel */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="p-4 border-b border-gray-800 bg-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold tracking-widest uppercase text-sm">
            <Settings2 className="w-5 h-5 text-red-500" />
            Bảng Điều Khiển Dịch Vụ
          </div>
          <button 
            onClick={() => handleConfigChange('isVisible', !config.isVisible)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${config.isVisible ? 'bg-green-600/20 text-green-400 border border-green-600/50' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
          >
            {config.isVisible ? <><Eye className="w-4 h-4" /> Đang Hiện</> : <><EyeOff className="w-4 h-4" /> Đang Ẩn</>}
          </button>
        </div>

        <div className="p-6 space-y-8 h-[700px] overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-800 pb-2">Thông Tin Cơ Bản</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Tên Dịch Vụ Nổi Bật</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => handleConfigChange('title', e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Ví dụ: Cày Thuê Siêu Tốc"
              />
            </div>
          </div>

          {/* Section 2: Combos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Danh Sách Combo</h3>
              <button onClick={addCombo} className="text-xs flex items-center gap-1 text-red-500 hover:text-red-400 font-bold uppercase">
                <PlusCircle className="w-4 h-4" /> Thêm Combo
              </button>
            </div>
            
            <div className="space-y-3">
              {config.combos.map((combo, index) => (
                <div key={combo.id} className="flex gap-2 items-start bg-black/50 p-3 rounded-lg border border-gray-800/50 relative group">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text"
                      value={combo.name || ''}
                      onChange={(e) => updateCombo(combo.id, 'name', e.target.value)}
                      placeholder="Tên combo..."
                      className="w-full bg-transparent border-b border-gray-800 px-2 py-1 text-sm text-white focus:border-red-500 outline-none"
                    />
                    <input 
                      type="number"
                      value={combo.price || ''}
                      onChange={(e) => updateCombo(combo.id, 'price', e.target.value)}
                      placeholder="Giá tiền (VNĐ)..."
                      className="w-full bg-transparent border-b border-gray-800 px-2 py-1 text-sm text-yellow-400 font-semibold focus:border-red-500 outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => removeCombo(combo.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    title="Xóa combo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {config.combos.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-4 italic">Chưa có combo nào. Vui lòng thêm combo.</div>
              )}
            </div>
          </div>

          {/* Section 3: Quantity Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Tùy Chọn Số Lượng</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={config.quantityConfig?.isEnable || false}
                  onChange={(e) => handleQuantityConfigChange('isEnable', e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            {config.quantityConfig.isEnable && (
              <div className="space-y-4 bg-black/30 p-4 rounded-xl border border-gray-800/50">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Tiêu đề bộ đếm</label>
                  <input
                    type="text"
                    value={config.quantityConfig?.label || ''}
                    onChange={(e) => handleQuantityConfigChange('label', e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2.5 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Giá mỗi đơn vị (VNĐ)</label>
                    <input
                      type="number"
                      value={config.quantityConfig?.unitPrice || ''}
                      onChange={(e) => handleQuantityConfigChange('unitPrice', e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2.5 text-yellow-400 font-bold text-sm focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Chữ trên nút bấm</label>
                    <input
                      type="text"
                      value={config.quantityConfig?.buttonText || ''}
                      onChange={(e) => handleQuantityConfigChange('buttonText', e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2.5 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Visual Identity */}
          <div className="space-y-4">
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-800 pb-2">Giao Diện & Màu Sắc</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Màu Nền</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.styles.bgColor || '#000000'}
                    onChange={(e) => handleStyleChange('bgColor', e.target.value)}
                    className="w-8 h-8 rounded shrink-0 cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={config.styles.bgColor || ''}
                    onChange={(e) => handleStyleChange('bgColor', e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded px-2 py-1.5 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Màu Viền</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.styles.borderColor || '#000000'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="w-8 h-8 rounded shrink-0 cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={config.styles.borderColor || ''}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded px-2 py-1.5 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Kiểu Chữ</label>
                <select
                  value={config.styles.fontStyle}
                  onChange={(e) => handleStyleChange('fontStyle', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="bold">Đậm (Bold)</option>
                  <option value="italic">Nghiêng (Italic)</option>
                  <option value="neon">Neon / Game</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Độ Bo Góc</label>
                <select
                  value={config.styles.rounded}
                  onChange={(e) => handleStyleChange('rounded', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="none">Vuông góc (0px)</option>
                  <option value="md">Vừa (md)</option>
                  <option value="xl">Lớn (xl)</option>
                  <option value="2xl">Rất lớn (2xl)</option>
                  <option value="full">Tròn (Full)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Độ Dày Viền</label>
                <select
                  value={config.styles.borderWidth}
                  onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="1px">Mỏng (1px)</option>
                  <option value="2px">Vừa (2px)</option>
                  <option value="4px">Dày (4px)</option>
                  <option value="8px">Rất Dày (8px)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Hiệu Ứng Động</label>
                <select
                  value={config.styles.animation}
                  onChange={(e) => handleStyleChange('animation', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="none">Không có</option>
                  <option value="pulse">Nhịp thở (Pulse)</option>
                  <option value="float">Lơ lửng (Float)</option>
                  <option value="shake">Lắc nhẹ khi Hover (Shake)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-gray-800">
              <div>
                <h4 className="text-sm font-semibold text-white">Hiệu ứng phát sáng (Glow)</h4>
                <p className="text-xs text-gray-500">Tạo viền neon tỏa sáng nổi bật xung quanh frame</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={config.styles.glow || false}
                  onChange={(e) => handleStyleChange('glow', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            
          </div>

        </div>

        <div className="p-4 border-t border-gray-800 bg-[#1f1f1f] flex gap-2 justify-end">
          <button 
            onClick={() => setShowJson(!showJson)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Code className="w-4 h-4" /> 
            {showJson ? 'Ẩn JSON' : 'Xem JSON'}
          </button>
          <button 
            onClick={handleSaveService}
            disabled={saving}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Đang Lưu...' : 'Lưu Dịch Vụ'}
          </button>
        </div>
      </div>

      {/* RIGHT: Live Preview panel */}
      <div className="flex flex-col gap-6">
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 min-h-[500px] flex items-center justify-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-gray-800 z-10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-black uppercase text-gray-300 tracking-widest">Live Preview</span>
          </div>

          {!config.isVisible ? (
            <div className="text-center">
              <EyeOff className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest">Dịch vụ đang bị ẩn</p>
            </div>
          ) : (
            <motion.div
              {...getAnimationProps()}
              className="w-full max-w-sm relative p-8 transition-all duration-300 z-20 group"
              style={{
                backgroundColor: config.styles.bgColor,
                borderColor: config.styles.borderColor,
                borderWidth: config.styles.borderWidth,
                borderStyle: 'solid',
                borderRadius: config.styles.rounded === 'none' ? '0' : 
                              config.styles.rounded === 'md' ? '0.375rem' :
                              config.styles.rounded === 'xl' ? '0.75rem' :
                              config.styles.rounded === '2xl' ? '1rem' : '9999px',
                boxShadow: config.styles.glow ? `0 0 30px ${config.styles.borderColor}40` : 'none'
              }}
            >
              {config.styles.glow && (
                <div 
                  className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 20px ${config.styles.borderColor}60`,
                    borderRadius: 'inherit'
                  }}
                ></div>
              )}

              <h2 className={`text-center text-3xl mb-8 ${
                  config.styles.fontStyle === 'bold' ? 'font-black' :
                  config.styles.fontStyle === 'italic' ? 'font-black italic' :
                  'font-black tracking-widest uppercase text-transparent bg-clip-text'
                }`}
                style={config.styles.fontStyle === 'neon' ? {
                  backgroundImage: `linear-gradient(to right, #fff, ${config.styles.borderColor})`,
                  filter: `drop-shadow(0 0 8px ${config.styles.borderColor}80)`
                } : { color: '#ffffff' }}
              >
                {config.title || 'Tên Dịch Vụ'}
              </h2>

              <div className="space-y-4">
                {config.combos.length > 0 && config.combos.map(combo => (
                  <div key={combo.id} className="flex justify-between items-center pb-3 border-b border-white/10 group-hover:border-white/20 transition-colors">
                    <span className="text-gray-300 font-medium">
                      {combo.name || 'Combo ...'}
                    </span>
                    <span 
                      className="font-black text-lg"
                      style={{ color: '#fbbf24' /* yellow-400 */}}
                    >
                      {combo.price ? parseInt(combo.price).toLocaleString('vi-VN') : '0'}đ
                    </span>
                  </div>
                ))}
              </div>
              
              {config.quantityConfig.isEnable ? (
                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs">
                      <Clock className="w-4 h-4" />
                      <span>{config.quantityConfig.label}</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#1f1f1f] rounded-lg p-2">
                      <button 
                        onClick={() => setPreviewQuantity(Math.max(1, previewQuantity - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-md bg-[#2a2a2a] hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-xl font-bold text-white w-16 text-center">{previewQuantity}</span>
                      <button 
                        onClick={() => setPreviewQuantity(previewQuantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-md bg-[#2a2a2a] hover:bg-green-500/20 text-gray-400 hover:text-green-500 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-gray-400 font-bold uppercase text-sm">Tổng tiền:</span>
                    <span className="text-blue-500 drop-shadow-md text-2xl font-black">
                      {(previewQuantity * (parseInt(config.quantityConfig.unitPrice) || 0)).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <button 
                    className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
                    style={{ boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)' }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {config.quantityConfig.buttonText}
                  </button>
                </div>
              ) : (
                <button 
                  className="w-full py-4 mt-8 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: config.styles.borderColor,
                    color: '#ffffff',
                    boxShadow: `0 4px 15px ${config.styles.borderColor}60`
                  }}
                >
                  Đặt Ngay
                </button>
              )}
            </motion.div>
          )}

        </div>

        {/* JSON Preview Output */}
        {showJson && (
          <div className="bg-[#141414] border border-gray-800 rounded-xl p-4 overflow-x-auto shadow-inner">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex justify-between">
              <span>Dữ Liệu JSON</span>
              <span className="text-gray-600">Trạng Thái Nội Bộ</span>
            </h4>
            <pre className="text-xs text-green-400 font-mono leading-relaxed">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* BOTTOM/SIDE: Saved Services List */}
      <div className="lg:col-span-2 mt-8">
        <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800 bg-[#1f1f1f]">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm">Danh Sách Dịch Vụ Đã Tạo</h3>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-[#1a1a1a] text-gray-500 border-b border-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-4 font-black tracking-wider">Tên Dịch Vụ</th>
                  <th scope="col" className="px-6 py-4 font-black tracking-wider">Số Combo</th>
                  <th scope="col" className="px-6 py-4 font-black tracking-wider">Trạng Thái Giao Diện</th>
                  <th scope="col" className="px-6 py-4 text-center font-black tracking-wider">Hiển Thị (Frontend)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{service.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-bold">{service.combos?.length || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: service.styles?.bgColor }}></span> Nền</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: service.styles?.borderColor }}></span> Viền ({service.styles?.borderWidth})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={service.isVisible || false}
                            onChange={() => toggleVisibility(service.id, service.isVisible)}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">Vui lòng tạo dịch vụ đầu tiên của bạn ở form phía trên.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
