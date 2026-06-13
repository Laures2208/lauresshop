import React, { useState } from 'react';
import { Copy, Check, QrCode, CreditCard, Landmark } from 'lucide-react';

interface OrderInfo {
  orderId: string;
  totalPrice: number;
}

interface QRCodePaymentProps {
  orderInfo: OrderInfo;
}

export const QRCodePayment: React.FC<QRCodePaymentProps> = ({ orderInfo }) => {
  const [copiedField, setCopiedField] = useState<'stk' | 'addInfo' | null>(null);

  const BANK_INFO = {
    name: 'VIB',
    bin: '970441',
    accountNo: '222082008',
    accountName: 'MAI NAM ANH',
  };

  const transferContent = `THANH TOAN DH ${orderInfo.orderId}`;
  const encodedContent = encodeURIComponent(transferContent);
  const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bin}-${BANK_INFO.accountNo}-compact2.jpg?amount=${orderInfo.totalPrice}&addInfo=${encodedContent}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;

  const handleCopy = (text: string, type: 'stk' | 'addInfo') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField(type);
        setTimeout(() => setCopiedField(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0d0d0d] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-gray-200">
      {/* Header */}
      <div className="bg-red-950/20 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-red-500" />
          <span className="font-black text-sm uppercase tracking-wider text-white">Thanh Toán VietQR</span>
        </div>
        <div className="bg-black/40 border border-gray-800 px-3 py-1 rounded text-[11px] font-mono text-gray-400">
          Mã DH: <span className="text-white font-bold">{orderInfo.orderId}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative group p-3 bg-white rounded-2xl shadow-xl transition-all hover:scale-[1.02] duration-300">
            <img
              src={qrUrl}
              alt="Mã QR Thanh Toán VietQR"
              className="w-48 h-48 rounded-lg object-contain"
            />
          </div>
          <p className="text-xs text-gray-400 text-center select-none">
            Sử dụng ứng dụng ngân hàng quét mã QR để thanh toán nhanh
          </p>
        </div>

        {/* Banking Table */}
        <div className="space-y-2 border-t border-gray-900 pt-5">
          {/* Bank name */}
          <div className="flex justify-between items-center py-2.5 border-b border-gray-900">
            <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black flex items-center gap-1.5">
              <Landmark className="w-3 h-3 text-red-500/70" /> Ngân hàng
            </span>
            <span className="text-white font-black text-sm">{BANK_INFO.name}</span>
          </div>

          {/* Account name */}
          <div className="flex justify-between items-center py-2.5 border-b border-gray-900">
            <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black flex items-center gap-1.5">
              <CreditCard className="w-3 h-3 text-red-500/70" /> Chủ tài khoản
            </span>
            <span className="text-white font-extrabold uppercase text-sm tracking-wide">{BANK_INFO.accountName}</span>
          </div>

          {/* Account Number */}
          <div className="flex justify-between items-center py-2.5 border-b border-gray-900">
            <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black">Số tài khoản</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono font-black text-sm">{BANK_INFO.accountNo}</span>
              <button
                type="button"
                onClick={() => handleCopy(BANK_INFO.accountNo, 'stk')}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-900 rounded-lg transition-all border border-transparent hover:border-gray-800"
                title="Sao chép số tài khoản"
              >
                {copiedField === 'stk' ? (
                  <Check className="w-3.5 h-3.5 text-green-500 animate-pulse" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex justify-between items-center py-2.5 border-b border-gray-900">
            <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black">Số tiền cần thanh toán</span>
            <span className="text-red-500 font-extrabold text-base tracking-wide">
              {orderInfo.totalPrice.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black">Nội dung chuyển khoản</span>
              <button
                type="button"
                onClick={() => handleCopy(transferContent, 'addInfo')}
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold bg-red-950/40 text-red-400 hover:text-red-300 border border-red-900/40 px-2.5 py-1 rounded-md transition-all active:scale-95"
              >
                {copiedField === 'addInfo' ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" /> Đã copy!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Sao chép nhanh
                  </>
                )}
              </button>
            </div>
            <div className="bg-black p-3 rounded-lg border border-gray-900 text-center font-mono font-extrabold text-white text-xs tracking-wider uppercase select-all shadow-inner">
              {transferContent}
            </div>
          </div>
        </div>

        {/* Note Warning block */}
        <div className="bg-red-950/20 border border-red-900/20 rounded-xl p-3.5 text-[11px] text-gray-400 leading-relaxed text-center shadow-inner">
          <strong className="text-red-500 uppercase tracking-wide">Lưu ý quan trọng:</strong> Vui lòng quét mã QR hoặc chuyển khoản đúng số tiền và nội dung phía trên để hệ thống duyệt đơn tự động.
        </div>
      </div>
    </div>
  );
};
