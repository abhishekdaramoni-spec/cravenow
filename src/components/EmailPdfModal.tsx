import React, { useState } from 'react';
import { OrderTrackingState } from '../types';
import { APP_IMAGES } from '../data/mockData';

interface EmailPdfModalProps {
  order: OrderTrackingState;
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const EmailPdfModal: React.FC<EmailPdfModalProps> = ({
  order,
  isOpen,
  onClose,
  onToast,
}) => {
  if (!isOpen) return null;

  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      onToast('Receipt PDF downloaded (342 KB)');
    }, 800);
  };

  const handlePrint = () => {
    onToast('Sending to AirPrint printer...');
    window.print();
  };

  const handleResend = () => {
    onToast('Receipt resent to alex.miller@example.com');
  };

  const handleExpense = () => {
    onToast('Receipt exported to Expensify & Concur');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300 p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1C1B1A] border-t sm:border border-neutral-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] max-w-md w-full overflow-hidden relative animate-toast-in text-neutral-100">
        {/* Header */}
        <div className="pt-3 px-5 pb-3 border-b border-neutral-800 flex-shrink-0 bg-[#1C1B1A]">
          <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-3 opacity-60 sm:hidden"></div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Email Receipt &amp; PDF Export
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E65A2C]/20 text-[#E65A2C] px-1.5 py-0.5 rounded border border-[#E65A2C]/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Sent to <span className="text-neutral-200 font-medium">alex.miller@example.com</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Preview */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar flex-1">
          {/* Inner Official Receipt Card */}
          <div className="bg-[#141312] border border-neutral-700 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="bg-gradient-to-r from-neutral-900 via-[#1C1B1A] to-neutral-900 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  alt="CraveNow Logo"
                  className="w-6 h-6 rounded-md object-cover border border-white/10"
                  src={APP_IMAGES.logo}
                />
                <div>
                  <p className="text-[11px] font-bold text-white leading-none font-mono uppercase tracking-wider">
                    CRAVENOW RECEIPT
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">#{order.orderId}</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-neutral-400 block">Today</span>
                <span className="text-[10px] font-semibold text-emerald-400">7:34 PM</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs pb-3 border-b border-neutral-800/80">
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">
                    DELIVERED TO
                  </span>
                  <span className="font-semibold text-neutral-200 block text-xs mt-0.5">
                    Alex Miller
                  </span>
                  <span className="text-[11px] text-neutral-400 block">
                    {order.deliveryAddress}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">
                    COURIER
                  </span>
                  <span className="font-semibold text-neutral-200 block text-xs mt-0.5">
                    {order.courier.name}
                  </span>
                  <span className="text-[11px] text-emerald-400 block">Delivered in 18 min</span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-500 block">
                  ITEMS SUMMARY
                </span>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-neutral-300 font-medium">{item.name}</span>
                    <span className="font-mono text-neutral-200 font-semibold">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-2 border-t border-dashed border-neutral-700/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-300">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Tax</span>
                  <span className="font-mono text-neutral-300">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Delivery Fee (CravePass)</span>
                  <span className="font-mono text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Courier Tip ({order.tipPercentText})</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    +${(order.userTip || order.tipAmount).toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-white block uppercase font-mono">
                      Total Paid
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <span className="text-lg font-extrabold text-white font-mono">
                    ${(order.subtotal + order.tax + (order.userTip || order.tipAmount)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Barcode */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>TXN: #{order.authCode}</span>
                <div className="flex items-center gap-1 opacity-70">
                  <div className="w-1 h-3.5 bg-neutral-400"></div>
                  <div className="w-0.5 h-3.5 bg-neutral-400"></div>
                  <div className="w-1.5 h-3.5 bg-neutral-400"></div>
                  <div className="w-0.5 h-3.5 bg-neutral-400"></div>
                  <div className="w-2 h-3.5 bg-neutral-400"></div>
                  <div className="w-1 h-3.5 bg-neutral-400"></div>
                  <div className="w-0.5 h-3.5 bg-neutral-400"></div>
                  <div className="w-1.5 h-3.5 bg-neutral-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[#E65A2C] text-[18px]">
                  download
                </span>
                <span>{downloading ? 'Exporting...' : 'Download PDF'}</span>
                <span className="text-[9px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 font-mono">
                  342 KB
                </span>
              </button>
              <button
                onClick={handlePrint}
                className="py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-neutral-400 text-[18px]">print</span>
                <span>Print / AirPrint</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleResend}
                className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-neutral-400 text-[16px]">mail</span>
                <span>Resend Email</span>
              </button>
              <button
                onClick={handleExpense}
                className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <span className="text-[9px] bg-amber-400/20 text-amber-400 px-1 py-0.2 rounded font-bold font-mono">
                  EXPENSE
                </span>
                <span>Expensify / Concur</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#141312] space-y-3 flex-shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Email delivered to alex.miller@example.com at 7:35 PM</span>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#E65A2C] hover:bg-[#D44C20] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E65A2C]/25 transition-all active:scale-[0.98]"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
