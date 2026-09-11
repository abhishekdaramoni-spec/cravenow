import React from 'react';
import { ScreenType, OrderTrackingState } from '../types';
import { APP_IMAGES } from '../data/mockData';

interface ProfileScreenProps {
  order: OrderTrackingState;
  onNavigate: (screen: ScreenType) => void;
  onOpenPdfModal: () => void;
  onToast: (msg: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  order,
  onNavigate,
  onOpenPdfModal,
  onToast,
}) => {
  return (
    <div className="flex flex-col w-full pb-28 text-[#e6e1df] px-3 sm:px-4 pt-2 max-w-md mx-auto space-y-4">
      {/* Profile Card */}
      <div className="bg-[#1c1b1a] rounded-3xl p-4 border border-white/5 flex items-center gap-3.5">
        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#f36334]/40 flex-shrink-0">
          <img src={APP_IMAGES.userProfile} alt="Alex Miller" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-white leading-tight">Alex Miller</h2>
          <p className="text-xs text-[#a88a81]">alex.miller@example.com</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[10px] bg-[#f36334]/20 text-[#ffb59f] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#f36334]/30">
              CravePass Member
            </span>
          </div>
        </div>
      </div>

      {/* CravePass Membership Status */}
      <div className="bg-gradient-to-r from-[#2a1a14] to-[#1c1b1a] border border-[#f36334]/30 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#ffb59f] block">CravePass VIP active</span>
          <p className="text-[11px] text-[#a88a81] mt-0.5">Unlimited $0 delivery fees on orders $12+</p>
        </div>
        <span className="material-symbols-outlined text-[#f36334] text-[24px]">verified</span>
      </div>

      {/* Past Receipts & Orders */}
      <div className="bg-[#1c1b1a] rounded-2xl p-4 border border-white/5 space-y-2.5">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          Recent Orders &amp; Receipts
        </span>

        <div className="p-3 bg-[#141312] rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">{order.restaurantName}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded font-mono">
                #{order.orderId}
              </span>
            </div>
            <p className="text-[11px] text-[#a88a81] mt-0.5">Today • 3 items • $31.70</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenPdfModal}
              className="p-2 rounded-lg bg-[#211f1e] text-[#f36334] hover:bg-[#2b2a28]"
              title="Download PDF"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </button>
            <button
              onClick={() => onNavigate('receipt')}
              className="px-2.5 py-1.5 rounded-lg bg-[#f36334] text-white text-xs font-bold hover:bg-[#d44c20]"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-[#1c1b1a] rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
        <div
          onClick={() => onToast('Address saved: 123 Main St, Apt 4B')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#211f1e] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">pin_drop</span>
            <span className="text-xs font-semibold text-white">Saved Delivery Addresses</span>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[18px]">chevron_right</span>
        </div>

        <div
          onClick={() => onToast('Payment method: Apple Pay (•••• 4128) verified')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#211f1e] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">credit_card</span>
            <span className="text-xs font-semibold text-white">Payment Methods (Apple Pay)</span>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[18px]">chevron_right</span>
        </div>

        <div
          onClick={() => onToast('Dietary preferences saved (Nut Allergy, Truffle lover)')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#211f1e] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">eco</span>
            <span className="text-xs font-semibold text-white">Dietary &amp; Allergy Preferences</span>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[18px]">chevron_right</span>
        </div>

        <div
          onClick={() => onToast('Notifications enabled for courier GPS updates')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#211f1e] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">notifications</span>
            <span className="text-xs font-semibold text-white">Push Notifications</span>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[18px]">chevron_right</span>
        </div>
      </div>
    </div>
  );
};
