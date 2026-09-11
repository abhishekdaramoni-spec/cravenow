import React, { useState } from 'react';
import { OrderTrackingState, ScreenType } from '../types';
import { APP_IMAGES } from '../data/mockData';

interface OrderReceiptScreenProps {
  order: OrderTrackingState;
  onNavigate: (screen: ScreenType) => void;
  onOpenPdfModal: () => void;
  onReorder: () => void;
  onToast: (msg: string) => void;
}

export const OrderReceiptScreen: React.FC<OrderReceiptScreenProps> = ({
  order,
  onNavigate,
  onOpenPdfModal,
  onReorder,
  onToast,
}) => {
  const [showPhotoLightbox, setShowPhotoLightbox] = useState(false);
  const [hasRatedRestaurant, setHasRatedRestaurant] = useState(false);

  const handleRateRestaurant = () => {
    setHasRatedRestaurant(true);
    onToast('5-Star rating submitted for Smash & Truffle Grill! 🌟');
  };

  const finalTotal = order.subtotal + order.tax + (order.userTip || order.tipAmount);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#141312] pb-32 text-neutral-100">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#141312]/90 backdrop-blur-md pt-safe pb-2 px-4 border-b border-white/5">
        <div className="flex items-center justify-between max-w-md mx-auto w-full pt-2">
          <div className="flex items-center space-x-2.5">
            <img
              src={APP_IMAGES.logo}
              alt="CraveNow Logo"
              className="w-8 h-8 rounded-lg shadow-md object-cover border border-white/10"
            />
            <div>
              <h1 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                CraveNow
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Order Fulfilled
                </span>
              </h1>
              <p className="text-[11px] text-neutral-400">
                Order #{order.orderId} • {order.restaurantName}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('feed')}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 transition-colors active:scale-95"
            title="Back to Feed"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* Interactive Celebration Toast Banner (Post-Rating Confirmation) */}
        <div className="bg-gradient-to-r from-[#172e22] via-[#162b20] to-[#1a231e] border border-emerald-500/40 rounded-2xl p-4 shadow-xl shadow-black/40 relative overflow-hidden animate-toast-in">
          {/* Ambient background glow */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-[#E65A2C]/15 rounded-full blur-lg pointer-events-none"></div>

          <div className="flex items-start gap-3 relative z-10">
            {/* Animated Checkmark Badge */}
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex-shrink-0 flex items-center justify-center animate-celebrate-pulse text-emerald-400">
              <span className="material-symbols-outlined text-[22px] font-bold">check</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  Rating &amp; Tip Received! <span>🎉</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-300/80">Just now</span>
              </div>
              <p className="text-xs text-neutral-100 font-semibold mt-0.5 leading-snug">
                Thanks! Your {order.userRating || 5}-Star rating &amp; ${(order.userTip || 5).toFixed(2)} tip were sent to {order.courier.name.split(' ')[0]}.
              </p>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                {order.courier.name.split(' ')[0]} receives 100% of your tip directly. Your compliment notes{' '}
                <span className="text-neutral-200 font-medium">({order.userCompliments.join(', ')})</span> were delivered.
              </p>
            </div>
          </div>

          {/* Mini Driver Acknowledgment Pill */}
          <div className="mt-3.5 pt-3 border-t border-emerald-500/20 flex items-center justify-between bg-black/30 rounded-xl px-3 py-2">
            <div className="flex items-center space-x-2.5">
              <img
                src={order.courier.avatar}
                alt={order.courier.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-400/40"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-none">
                  {order.courier.name}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {order.courier.badge} • {order.courier.vehicle.split(' ')[1] || 'Civic'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/25">
              <span>★</span>
              <span>5.0 Updated</span>
            </div>
          </div>
        </div>

        {/* Digital Receipt Card (Warm Charcoal) */}
        <div className="bg-[#1C1B1A] border border-neutral-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          {/* CraveNow Watermark / Header */}
          <div className="flex justify-between items-start border-b border-neutral-800/80 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono tracking-widest text-[#E65A2C] uppercase font-bold">
                  Official Receipt
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] text-emerald-400 font-medium">Paid in Full</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">{order.restaurantName}</h2>
              <p className="text-xs text-neutral-400">
                {order.restaurantAddress} • Delivered to Apt 4B
              </p>
            </div>
            <div className="text-right font-mono">
              <p className="text-[11px] text-neutral-400">Date &amp; Time</p>
              <p className="text-xs font-semibold text-neutral-200">Today, 7:34 PM</p>
              <span className="inline-block mt-1 text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700">
                #{order.orderId}
              </span>
            </div>
          </div>

          {/* Photo Proof Mini Thumbnail strip */}
          <div className="mt-4 p-2.5 bg-[#141312] border border-neutral-800 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => setShowPhotoLightbox(true)}
                className="relative w-12 h-12 rounded-xl overflow-hidden border border-neutral-700 flex-shrink-0 cursor-pointer hover:opacity-85"
              >
                <img
                  src={order.dropOffPhotoUrl}
                  alt="Doorstep Delivery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-neutral-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">
                    photo_camera
                  </span>
                  Drop-off Photo Verified
                </span>
                <p className="text-xs text-neutral-400">
                  Doorstep mat at Apt 4B • Safe &amp; Contactless
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPhotoLightbox(true)}
              className="text-xs font-semibold text-[#E65A2C] hover:underline px-2 py-1"
            >
              View
            </button>
          </div>

          {/* Itemized Breakdown */}
          <div className="mt-4 pt-2 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
              Ordered Items
            </p>

            {order.items.map((item, index) => (
              <div key={index} className="flex items-start justify-between text-xs">
                <div className="flex-1 pr-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-neutral-200">{item.name}</span>
                    {item.customization && (
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded">
                        {item.customization}
                      </span>
                    )}
                  </div>
                  {item.details && (
                    <p className="text-[11px] text-neutral-400 mt-0.5">{item.details}</p>
                  )}
                </div>
                <span className="font-mono text-neutral-200 font-semibold">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Dotted Divider Line */}
          <div className="my-4 border-b border-dashed border-neutral-700/80"></div>

          {/* Subtotals & Added Post-Delivery Tip */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Food Subtotal</span>
              <span className="font-mono text-neutral-300">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Estimated Taxes</span>
              <span className="font-mono text-neutral-300">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span className="flex items-center gap-1.5">
                Delivery Fee
                <span className="text-[10px] bg-[#E65A2C]/20 text-[#E65A2C] px-1.5 py-0.2 rounded font-bold">
                  CravePass
                </span>
              </span>
              <span className="font-mono text-emerald-400 font-medium">FREE ($3.99)</span>
            </div>

            {/* Tip Highlight Section */}
            <div className="flex justify-between items-center py-2 px-3 bg-neutral-900/90 rounded-xl border border-neutral-800">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">Courier Tip</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    {order.tipPercentText} Added
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Submitted via 5-Star Rating Modal</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-emerald-400 font-bold text-sm">
                  +${(order.userTip || order.tipAmount).toFixed(2)}
                </span>
                <span className="block text-[9px] text-neutral-500">
                  Direct to {order.courier.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Total Paid Card */}
          <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-between items-end">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 block font-mono">
                Final Total Paid
              </span>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-white">smartphone</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white font-mono leading-none">
                ${finalTotal.toFixed(2)}
              </span>
              <span className="block text-[10px] text-emerald-400 font-semibold mt-1">
                Receipt Emailed to user
              </span>
            </div>
          </div>

          {/* Barcode / Authenticity footer */}
          <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                AUTH CODE: {order.authCode}
              </span>
              <span className="text-[10px] text-neutral-500">CraveNow Inc. • VAT #849204</span>
            </div>
            <div className="h-6 w-32 flex items-center justify-end space-x-1 opacity-60">
              <div className="w-1 h-full bg-white"></div>
              <div className="w-0.5 h-full bg-white"></div>
              <div className="w-1.5 h-full bg-white"></div>
              <div className="w-0.5 h-full bg-white"></div>
              <div className="w-2 h-full bg-white"></div>
              <div className="w-0.5 h-full bg-white"></div>
              <div className="w-1 h-full bg-white"></div>
              <div className="w-1.5 h-full bg-white"></div>
              <div className="w-0.5 h-full bg-white"></div>
              <div className="w-1 h-full bg-white"></div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Next Steps Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onOpenPdfModal}
            className="bg-[#1C1B1A] hover:bg-[#252423] border border-neutral-800 rounded-2xl p-3.5 text-left transition-colors flex items-center space-x-3 group active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-800 group-hover:bg-[#E65A2C]/20 text-[#E65A2C] flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Download PDF</span>
              <span className="text-[10px] text-neutral-400">Save for expense</span>
            </div>
          </button>

          <button
            onClick={handleRateRestaurant}
            className="bg-[#1C1B1A] hover:bg-[#252423] border border-neutral-800 rounded-2xl p-3.5 text-left transition-colors flex items-center space-x-3 group active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-800 group-hover:bg-amber-400/20 text-amber-400 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[20px]">star</span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {hasRatedRestaurant ? 'Rated 5.0 ⭐' : 'Rate Restaurant'}
              </span>
              <span className="text-[10px] text-neutral-400 truncate block max-w-[100px]">
                {order.restaurantName}
              </span>
            </div>
          </button>
        </div>

        {/* CraveRewards Earned Banner */}
        <div className="bg-gradient-to-r from-neutral-900 to-[#1e1a17] border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <span className="text-base font-black font-mono">+63</span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">CravePoints Earned!</span>
              <span className="text-[10px] text-neutral-400">Total balance: 1,420 pts ($14.20 off next meal)</span>
            </div>
          </div>
          <button 
            onClick={() => onToast('CravePoints balance: 1,420 ($14.20 credit available)')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            View Rewards &rarr;
          </button>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-[#141312]/95 backdrop-blur-lg border-t border-neutral-800 p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {/* Reorder Button */}
          <button
            onClick={onReorder}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-white/10"
          >
            <span className="material-symbols-outlined text-[16px] text-[#E65A2C]">replay</span>
            Reorder This Meal
          </button>

          {/* Return to Feed Primary CTA */}
          <button
            onClick={() => onNavigate('feed')}
            className="flex-[1.4] py-3.5 px-4 rounded-2xl bg-[#E65A2C] hover:bg-[#D44C20] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E65A2C]/25 transition-all active:scale-[0.98]"
          >
            <span>Back to Explore</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </footer>

      {/* Photo Lightbox */}
      {showPhotoLightbox && (
        <div
          onClick={() => setShowPhotoLightbox(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-sm w-full bg-[#1c1b1a] rounded-2xl overflow-hidden p-3 border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowPhotoLightbox(false)}
              className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            <img
              src={order.dropOffPhotoUrl}
              alt="Expanded Drop-Off Photo"
              className="w-full h-auto rounded-xl object-cover"
            />
            <div className="pt-3 text-center">
              <span className="text-xs font-bold text-white block">
                Drop-Off Verification Photo
              </span>
              <span className="text-[11px] text-neutral-400">
                Delivered safely to Apt 4B doorstep mat
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
