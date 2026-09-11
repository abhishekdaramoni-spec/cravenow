import React, { useState } from 'react';
import { OrderTrackingState, ScreenType } from '../types';

interface LiveTrackerScreenProps {
  order: OrderTrackingState;
  onNavigate: (screen: ScreenType) => void;
  onUpdateTip: (tipAmount: number, tipLabel: string) => void;
  onSimulateDelivery: () => void;
  onToast: (msg: string) => void;
}

export const LiveTrackerScreen: React.FC<LiveTrackerScreenProps> = ({
  order,
  onNavigate,
  onUpdateTip,
  onSimulateDelivery,
  onToast,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(true);
  const [selectedTipIndex, setSelectedTipIndex] = useState<number>(2); // 20% by default

  const tipOptions = [
    { label: '10% ($2.45)', amount: 2.45, name: '10%' },
    { label: '15% ($3.68)', amount: 3.68, name: '15%' },
    { label: '⭐ 20%', amount: 4.90, name: '20%' },
    { label: 'Custom', amount: 6.00, name: 'Custom' },
  ];

  const handleTipClick = (index: number) => {
    setSelectedTipIndex(index);
    if (index === 3) {
      const customVal = prompt('Enter custom tip amount ($):', '6.00');
      const parsed = parseFloat(customVal || '0');
      if (!isNaN(parsed) && parsed >= 0) {
        onUpdateTip(parsed, 'Custom');
        onToast(`Custom tip of $${parsed.toFixed(2)} selected`);
      }
    } else {
      const opt = tipOptions[index];
      onUpdateTip(opt.amount, opt.name);
      onToast(`Courier tip updated to $${opt.amount.toFixed(2)}`);
    }
  };

  const handleShare = () => {
    onToast('Live tracking link copied to clipboard! 🔗');
  };

  const currentTotal = order.subtotal + order.tax + order.tipAmount;

  return (
    <div className="flex flex-col w-full pb-28 text-[#e6e1df]">
      {/* Live Map Header Box */}
      <div className="relative w-full h-80 overflow-hidden bg-[#0f0e0d]">
        <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#363433" strokeWidth="0.75" strokeOpacity="0.35" />
            </pattern>
            <linearGradient id="route-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f36334" />
              <stop offset="100%" stopColor="#ffb59f" />
            </linearGradient>
            <filter id="glow-terracotta" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="#141312" />
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {/* City blocks & road abstractions */}
          <path d="M -20 110 Q 120 140 260 90 T 440 130" fill="none" stroke="#211f1e" strokeWidth="26" strokeLinecap="round" />
          <path d="M 30 -20 Q 80 180 140 340" fill="none" stroke="#211f1e" strokeWidth="18" strokeLinecap="round" />
          <path d="M 220 340 L 310 -20" fill="none" stroke="#211f1e" strokeWidth="20" strokeLinecap="round" />
          <path d="M 80 40 L 360 280" fill="none" stroke="#2b2a28" strokeWidth="10" strokeLinecap="round" />

          {/* Route trajectory */}
          <path
            d="M 64 245 C 110 230, 150 190, 190 145 C 225 105, 270 95, 335 80"
            fill="none"
            stroke="rgba(243, 99, 52, 0.25)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 64 245 C 110 230, 150 190, 190 145 C 225 105, 270 95, 335 80"
            fill="none"
            stroke="url(#route-gradient)"
            strokeWidth="4.5"
            strokeDasharray="8 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Restaurant Pin */}
          <g transform="translate(64, 245)">
            <circle r="14" fill="#211f1e" />
            <circle r="5" fill="#e1bfb5" />
          </g>

          {/* Customer Destination Pin */}
          <g transform="translate(335, 80)">
            <circle r="18" fill="#f36334" fillOpacity="0.25" />
            <circle r="10" fill="#f36334" />
            <circle r="4" fill="#ffffff" />
          </g>

          {/* Live Courier Position (pulsing marker) */}
          <g transform="translate(195, 140)" filter="url(#glow-terracotta)">
            <circle r="16" fill="#f36334" fillOpacity="0.3">
              <animate attributeName="r" values="14;24;14" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r="12" fill="#f36334" />
            <circle r="6" fill="#ffffff" />
          </g>
        </svg>

        {/* Top GPS Floating Indicator */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1b1a]/90 backdrop-blur-md shadow-md border border-white/5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            Live GPS Tracking
          </span>
        </div>

        {/* Floating Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => onToast('Map recentered on courier Sarah Jenkins')}
            className="w-10 h-10 rounded-full bg-[#1c1b1a]/90 backdrop-blur-md text-[#f36334] flex items-center justify-center shadow-lg active:scale-95 transition-transform border border-white/5"
            title="Recenter Map"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
          <button
            onClick={() => onToast('Expanded full-screen GPS view')}
            className="w-10 h-10 rounded-full bg-[#1c1b1a]/90 backdrop-blur-md text-[#a88a81] hover:text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform border border-white/5"
            title="Full Map"
          >
            <span className="material-symbols-outlined text-[20px]">fullscreen</span>
          </button>
        </div>

        {/* Courier Dynamic Micro Tag */}
        <div className="absolute top-24 left-24 z-10 px-2.5 py-1 rounded-full bg-[#363433]/90 backdrop-blur-md flex items-center gap-1.5 shadow-md border border-white/10">
          <span className="material-symbols-outlined text-[15px] text-[#f36334]">moped</span>
          <span className="text-[11px] font-bold text-white">Sarah • 0.8 mi away</span>
        </div>

        {/* Origin & Destination Floating Tags */}
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-[#1c1b1a]/90 backdrop-blur-md flex items-center gap-2 max-w-[65%] border border-white/5 shadow-md">
          <span className="material-symbols-outlined text-[#f36334] text-[18px]">storefront</span>
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{order.restaurantName}</p>
            <p className="text-[10px] text-[#a88a81] truncate">{order.restaurantAddress}</p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-[#1c1b1a]/90 backdrop-blur-md flex items-center gap-1.5 border border-white/5 shadow-md">
          <span className="material-symbols-outlined text-[#f36334] text-[18px]">home</span>
          <span className="text-xs font-bold text-white">Apt 4B</span>
        </div>
      </div>

      {/* Primary Content Sheet */}
      <div className="flex flex-col gap-4 px-3 sm:px-4 -mt-4 z-20">
        {/* ETA Hero Status Card */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#1c1b1a] shadow-xl border border-white/5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f36334]">
                Estimated Arrival
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-headline-lg font-black text-white text-3xl tracking-tight">
                  {order.status === 'delivered' ? 'ARRIVED' : `${order.estimatedArrivalMin} – ${order.estimatedArrivalMax}`}
                </span>
                {order.status !== 'delivered' && (
                  <span className="text-sm font-extrabold text-[#f36334]">MINS</span>
                )}
              </div>
              <p className="text-xs text-[#a88a81] mt-1">
                {order.status === 'delivered'
                  ? 'Your order has been delivered safely at your door!'
                  : 'Sarah is on her way to your address with hot food'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#f36334]/20 flex items-center justify-center text-[#f36334] border border-[#f36334]/30">
              <span className="material-symbols-outlined text-[28px] animate-pulse">
                local_shipping
              </span>
            </div>
          </div>

          {/* Segmented Milestone Progress Stepper */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="grid grid-cols-4 gap-1.5 w-full">
              <div className="h-2 rounded-full bg-[#f36334]"></div>
              <div className="h-2 rounded-full bg-[#f36334]"></div>
              <div className="h-2 rounded-full bg-[#f36334] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#ffb59f]/40 animate-pulse"></div>
              </div>
              <div className={`h-2 rounded-full ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-[#363433]'}`}></div>
            </div>

            <div className="grid grid-cols-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-xs text-white font-semibold">Confirmed</span>
                <span className="text-[10px] text-[#a88a81]">{order.confirmedTime}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-white font-semibold">Kitchen</span>
                <span className="text-[10px] text-[#a88a81]">{order.kitchenTime}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#f36334] font-bold">On the Way</span>
                <span className="text-[10px] text-[#f36334]">{order.onTheWayTime}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-xs ${order.status === 'delivered' ? 'text-emerald-400 font-bold' : 'text-[#a88a81]'}`}>
                  Delivered
                </span>
                <span className="text-[10px] text-[#a88a81]">{order.deliveredTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Card Profile */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#1c1b1a] shadow-lg border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#211f1e] ring-2 ring-[#f36334]/30 shrink-0">
                <img
                  alt={order.courier.name}
                  className="w-full h-full object-cover"
                  src={order.courier.avatar}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-base truncate">
                    {order.courier.name}
                  </span>
                  <span
                    className="material-symbols-outlined text-[16px] text-[#ffba49]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-0.5 text-xs font-bold text-[#ffba49]">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {order.courier.rating}
                  </span>
                  <span className="text-xs text-[#a88a81]">
                    • {order.courier.totalDeliveries} deliveries
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#211f1e] text-[11px] text-[#e1bfb5] border border-white/5">
                    {order.courier.vehicle} • {order.courier.plate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Action Buttons: Call & Message */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href={`tel:${order.courier.phone}`}
              className="h-12 flex items-center justify-center gap-2 rounded-full bg-[#f36334] text-white font-bold text-xs shadow-md hover:bg-[#d44c20] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">phone</span>
              <span>Call Sarah</span>
            </a>
            <button
              onClick={() => onNavigate('chat')}
              className="h-12 flex items-center justify-center gap-2 rounded-full bg-[#2b2a28] text-white font-bold text-xs hover:bg-[#363433] active:scale-95 transition-all border border-white/5"
            >
              <span className="material-symbols-outlined text-[18px] text-[#f36334]">
                chat_bubble
              </span>
              <span>Message</span>
            </button>
          </div>

          {/* Drop-off Instruction Note */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#211f1e] border border-white/5">
            <span className="material-symbols-outlined text-[#f36334] text-[18px] shrink-0">
              doorbell
            </span>
            <span className="text-xs text-neutral-200">
              Instructions: "Leave at front doorstep, ring unit 4B buzzer."
            </span>
          </div>
        </div>

        {/* Live Order Details Accordion Card */}
        <div className="flex flex-col rounded-2xl bg-[#1c1b1a] shadow-md overflow-hidden border border-white/5">
          <div
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="flex items-center justify-between p-4 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#211f1e] flex items-center justify-center text-[#f36334] border border-white/5">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">Order Summary</h2>
                <p className="text-xs text-[#a88a81]">
                  {order.items.length} items from {order.restaurantName}
                </p>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[#a88a81] transition-transform duration-200 ${
                isAccordionOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </div>

          {isAccordionOpen && (
            <div className="flex flex-col gap-3 px-4 pb-4 pt-0 border-t border-white/5">
              {/* Items list */}
              <div className="flex flex-col gap-2 pt-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#211f1e] flex items-center justify-center text-[11px] text-[#f36334] font-bold">
                        {item.quantity}×
                      </span>
                      <span className="font-medium text-white">{item.name.replace(/^\d+×\s*/, '')}</span>
                    </div>
                    <span className="font-bold text-white font-mono">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Add Tip Pills */}
              <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-neutral-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Add a Tip for Sarah
                  </span>
                  <span className="text-[11px] text-[#f36334] font-medium">
                    100% goes to driver
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {tipOptions.map((opt, idx) => {
                    const isSelected = selectedTipIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTipClick(idx)}
                        className={`py-2 rounded-full text-xs font-bold transition-all active:scale-95 text-center ${
                          isSelected
                            ? 'bg-[#f36334] text-white shadow-sm shadow-[#f36334]/30 ring-1 ring-white/20'
                            : 'bg-[#211f1e] text-[#a88a81] hover:text-white border border-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Math breakdown */}
              <div className="flex flex-col gap-1.5 pt-2 text-xs border-t border-neutral-800">
                <div className="flex justify-between text-[#a88a81]">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#a88a81]">
                  <span>Estimated Taxes</span>
                  <span className="font-mono text-neutral-200">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#a88a81]">
                  <span>Delivery Fee</span>
                  <span className="text-[#f36334] font-semibold">{order.deliveryFeeText}</span>
                </div>
                <div className="flex justify-between text-[#a88a81]">
                  <span>Driver Tip</span>
                  <span className="font-mono text-emerald-400 font-bold">+${order.tipAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="font-bold text-white text-sm">Total</span>
                  <span className="text-base font-extrabold text-[#f36334] font-mono">
                    ${currentTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 justify-end text-[11px] text-[#a88a81]">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simulate Order Delivered & Rating CTA Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-neutral-900 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-400 text-[24px]">check_circle</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Courier Arriving at Door</span>
              <span className="text-[11px] text-neutral-400">Preview drop-off &amp; tip workflow</span>
            </div>
          </div>
          <button
            onClick={onSimulateDelivery}
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md active:scale-95 transition-transform"
          >
            Mark Delivered
          </button>
        </div>

        {/* Help & Support */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1c1b1a] shadow-sm border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#211f1e] flex items-center justify-center text-[#a88a81]">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Need help with your order?</h3>
              <p className="text-[11px] text-[#a88a81]">Live agent assistance &amp; order updates</p>
            </div>
          </div>
          <button
            onClick={() => onToast('Connecting with 24/7 CraveNow Live Agent...')}
            className="px-3.5 py-1.5 rounded-full bg-[#2b2a28] hover:bg-[#363433] text-xs font-bold text-[#f36334] active:scale-95 transition-all border border-white/5"
          >
            Contact
          </button>
        </div>

        {/* Share Live Tracking Link Button */}
        <button
          onClick={handleShare}
          className="w-full h-12 py-3 flex items-center justify-center gap-2 rounded-full bg-[#211f1e] hover:bg-[#2b2a28] text-[#a88a81] hover:text-white text-xs font-bold active:scale-98 transition-all border border-white/5"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span>Share Live Tracking Link</span>
        </button>
      </div>
    </div>
  );
};
