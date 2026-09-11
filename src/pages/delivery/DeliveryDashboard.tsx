import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/constants';
import { useToast } from '@/contexts/ToastContext';

export default function DeliveryDashboard() {
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [deliveryStep, setDeliveryStep] = useState<'picked_up' | 'on_the_way' | 'delivered'>('on_the_way');

  const activeDelivery = {
    orderId: 'ORD-9841',
    restaurant: 'La Piazza',
    restaurantAddress: 'Bandra West, Mumbai',
    customer: 'Sneha Roy',
    customerAddress: 'Flat 402, Sea Breeze Apts, Bandra West',
    customerPhone: '+91 98765 12345',
    items: ['Margherita Pizza x1', 'Penne Arrabbiata x1'],
    earnings: 65,
    distanceKm: 2.4,
  };

  const advanceDelivery = () => {
    if (deliveryStep === 'picked_up') {
      setDeliveryStep('on_the_way');
      showToast('Order marked as On the Way! 🛵');
    } else if (deliveryStep === 'on_the_way') {
      setDeliveryStep('delivered');
      showToast('Delivery marked as Fulfilled! 🎉 ₹65 credited to your wallet.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] p-4 sm:p-6 max-w-xl mx-auto pb-32">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#f36334]/20 border border-[#f36334]/40 flex items-center justify-center text-lg">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm text-white">Rahul Kumar</h1>
              <span className="text-[10px] bg-amber-400/20 text-amber-400 px-1.5 py-0.2 rounded font-bold">★ 4.9</span>
            </div>
            <span className="text-[11px] text-[#a88a81]">Honda Activa • DL-1234</span>
          </div>
        </div>

        {/* Online / Offline switch */}
        <button
          onClick={() => {
            setIsOnline(!isOnline);
            showToast(isOnline ? 'You are now Offline. No new orders will be routed.' : 'You are now Online! Listening for delivery requests 📡');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            isOnline
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-[#211f1e] text-[#a88a81] border border-white/5'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-[#a88a81]'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2.5 my-4">
        <div className="bg-[#1c1b1a] p-3 rounded-2xl border border-white/5">
          <span className="text-[11px] text-[#a88a81]">Today&apos;s Pay</span>
          <span className="text-base font-bold text-white block mt-0.5">{formatPrice(740)}</span>
        </div>
        <div className="bg-[#1c1b1a] p-3 rounded-2xl border border-white/5">
          <span className="text-[11px] text-[#a88a81]">Trips Done</span>
          <span className="text-base font-bold text-white block mt-0.5">11 trips</span>
        </div>
        <div className="bg-[#1c1b1a] p-3 rounded-2xl border border-white/5">
          <span className="text-[11px] text-[#a88a81]">Tips Earned</span>
          <span className="text-base font-bold text-emerald-400 block mt-0.5">{formatPrice(120)}</span>
        </div>
      </div>

      {/* Active Trip Card */}
      {deliveryStep !== 'delivered' ? (
        <div className="bg-[#1c1b1a] rounded-3xl border border-[#f36334]/30 p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#f36334] bg-[#f36334]/15 px-2 py-0.5 rounded-full border border-[#f36334]/20">
              Active Delivery • #{activeDelivery.orderId}
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">+{formatPrice(activeDelivery.earnings)}</span>
          </div>

          {/* Map mockup */}
          <div className="relative h-28 bg-[#141312] rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden mb-4">
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="delivery-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#delivery-grid)" />
            </svg>
            <div className="flex items-center gap-4 z-10">
              <span className="text-xs font-bold text-white bg-[#211f1e] px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1">
                📍 {activeDelivery.restaurant}
              </span>
              <span className="text-[#f36334] text-xs font-mono">━━ 🛵 ━━</span>
              <span className="text-xs font-bold text-white bg-[#211f1e] px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1">
                🏁 {activeDelivery.customer}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="text-sm">🏪</span>
              <div>
                <span className="font-bold text-white block">Pickup: {activeDelivery.restaurant}</span>
                <span className="text-[11px] text-[#a88a81]">{activeDelivery.restaurantAddress}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-sm">🏠</span>
              <div>
                <span className="font-bold text-white block">Deliver: {activeDelivery.customer}</span>
                <span className="text-[11px] text-[#a88a81]">{activeDelivery.customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-3 pt-2.5 border-t border-white/5 text-xs text-[#ffb59f]">
            {activeDelivery.items.join(' • ')}
          </div>

          {/* Action Button */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => showToast(`Calling customer at ${activeDelivery.customerPhone}`)}
              className="flex-1 py-3 rounded-2xl bg-[#211f1e] hover:bg-[#2b2a28] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              Call
            </button>
            <button
              onClick={advanceDelivery}
              className="flex-[2] py-3 rounded-2xl bg-[#f36334] hover:bg-[#d44c20] text-xs font-bold text-white shadow-lg shadow-[#f36334]/25 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {deliveryStep === 'picked_up' ? 'Start Ride (On the Way)' : 'Mark Delivered'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1c1b1a] rounded-3xl p-6 border border-white/5 text-center space-y-3">
          <span className="text-4xl block">🎉</span>
          <h3 className="font-bold text-white text-base">Order Completed!</h3>
          <p className="text-xs text-[#a88a81]">Great job! You made ₹65 on this trip. Waiting for next order assignment...</p>
          <button
            onClick={() => {
              setDeliveryStep('on_the_way');
              showToast('Simulated new order assigned!');
            }}
            className="px-4 py-2 rounded-xl bg-[#211f1e] hover:bg-[#2b2a28] text-xs font-bold text-white"
          >
            Simulate Next Delivery
          </button>
        </div>
      )}

      {/* Customer navigation footer link */}
      <div className="mt-6 text-center">
        <Link to="/" className="text-xs text-[#a88a81] hover:text-white underline">
          Switch to Customer Experience &rarr;
        </Link>
      </div>
    </div>
  );
}
