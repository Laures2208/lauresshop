import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Clock, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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

type FirebaseService = {
  id: string;
  isVisible: boolean;
  title: string;
  combos: Combo[];
  styles: StylesConfig;
  quantityConfig: QuantityConfig;
};

const ServiceCard: React.FC<{ service: FirebaseService }> = ({ service }) => {
  const [quantity, setQuantity] = useState(1);
  const { showToast } = useShop();

  const styles = service.styles || {
    fontStyle: 'bold',
    bgColor: '#141414',
    borderColor: '#dc2626',
    borderWidth: '2px',
    rounded: 'xl',
    glow: true,
    animation: 'pulse',
  };

  const getAnimationProps = () => {
    const animation = styles.animation;
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

  const handleOrder = () => {
    showToast('Vui lòng đăng nhập để đặt dịch vụ!', 'error');
  };

  return (
    <motion.div
      {...getAnimationProps()}
      className="w-full relative p-8 transition-all duration-300 z-20 group max-w-sm mx-auto"
      style={{
        backgroundColor: styles.bgColor,
        borderColor: styles.borderColor,
        borderWidth: styles.borderWidth,
        borderStyle: 'solid',
        borderRadius: styles.rounded === 'none' ? '0' : 
                      styles.rounded === 'md' ? '0.375rem' :
                      styles.rounded === 'xl' ? '0.75rem' :
                      styles.rounded === '2xl' ? '1rem' : '9999px',
        boxShadow: styles.glow ? `0 0 30px ${styles.borderColor}40` : 'none'
      }}
    >
      {styles.glow && (
        <div 
          className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${styles.borderColor}60`,
            borderRadius: 'inherit'
          }}
        ></div>
      )}

      <h2 className={`text-center text-3xl mb-8 ${
          styles.fontStyle === 'bold' ? 'font-black' :
          styles.fontStyle === 'italic' ? 'font-black italic' :
          'font-black tracking-widest uppercase text-transparent bg-clip-text'
        }`}
        style={styles.fontStyle === 'neon' ? {
          backgroundImage: `linear-gradient(to right, #fff, ${styles.borderColor})`,
          filter: `drop-shadow(0 0 8px ${styles.borderColor}80)`
        } : { color: '#ffffff' }}
      >
        {service.title || 'Tên Dịch Vụ'}
      </h2>

      <div className="space-y-4">
        {service.combos?.map(combo => (
          <div key={combo.id} className="flex justify-between items-center pb-3 border-b border-white/10 group-hover:border-white/20 transition-colors">
            <span className="text-gray-300 font-medium">
              {combo.name || 'Combo ...'}
            </span>
            <span 
              className="font-black text-lg"
              style={{ color: '#fbbf24' }}
            >
              {combo.price ? parseInt(combo.price).toLocaleString('vi-VN') : '0'}đ
            </span>
          </div>
        ))}
      </div>
      
      {service.quantityConfig?.isEnable ? (
        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs">
              <Clock className="w-4 h-4" />
              <span>{service.quantityConfig.label}</span>
            </div>
            
            <div className="flex items-center justify-between bg-[#1f1f1f] rounded-lg p-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-[#2a2a2a] hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-bold text-white w-16 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-[#2a2a2a] hover:bg-green-500/20 text-gray-400 hover:text-green-500 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-gray-400 font-bold uppercase text-sm">Tổng tiền:</span>
            <span className="text-blue-500 drop-shadow-md text-2xl font-black">
              {(quantity * (parseInt(service.quantityConfig.unitPrice) || 0)).toLocaleString('vi-VN')}đ
            </span>
          </div>

          <button 
            onClick={handleOrder}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
            style={{ boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)' }}
          >
            <ShoppingCart className="w-5 h-5" />
            {service.quantityConfig.buttonText}
          </button>
        </div>
      ) : (
        <button 
          onClick={handleOrder}
          className="w-full py-4 mt-8 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105"
          style={{
            backgroundColor: styles.borderColor,
            color: '#ffffff',
            boxShadow: `0 4px 15px ${styles.borderColor}60`
          }}
        >
          Đặt Ngay
        </button>
      )}
    </motion.div>
  );
}

export const DynamicServicesList: React.FC = () => {
  const [services, setServices] = useState<FirebaseService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'custom_services'),
      where('isVisible', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData: FirebaseService[] = [];
      snapshot.forEach((doc) => {
        servicesData.push({ id: doc.id, ...doc.data() } as FirebaseService);
      });
      setServices(servicesData);
      setLoading(false);
    }, (error) => {
      console.error('Lỗi tải danh sách dịch vụ:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-black uppercase text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] tracking-widest flex items-center justify-center gap-3">
            <span className="w-12 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
            DỊCH VỤ ĐẶC BIỆT
            <span className="w-12 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full max-w-sm mx-auto h-[400px] rounded-xl bg-gray-800/50 animate-pulse border border-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-black uppercase text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] tracking-widest flex items-center justify-center gap-3">
            <span className="w-12 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
            DỊCH VỤ ĐẶC BIỆT
            <span className="w-12 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
        </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
