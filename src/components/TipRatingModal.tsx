import React, { useState } from 'react';
import { Courier } from '../types';

interface TipRatingModalProps {
  courier: Courier;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, tip: number, compliments: string[], note: string) => void;
}

export const TipRatingModal: React.FC<TipRatingModalProps> = ({
  courier,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [rating, setRating] = useState<number>(5);
  const [selectedTip, setSelectedTip] = useState<number>(5.0);
  const [customTip, setCustomTip] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([
    '⚡ Super Fast',
    '🍲 Handled with Care',
    '💬 Great Communication',
  ]);
  const [note, setNote] = useState<string>('');

  const complimentsList = [
    '⚡ Super Fast',
    '🍲 Handled with Care',
    '💬 Great Communication',
    '🚪 Followed Instructions',
    '🌟 Friendly & Polite',
  ];

  const toggleCompliment = (comp: string) => {
    if (selectedCompliments.includes(comp)) {
      setSelectedCompliments(selectedCompliments.filter((c) => c !== comp));
    } else {
      setSelectedCompliments([...selectedCompliments, comp]);
    }
  };

  const tipPresets = [
    { amount: 3.0, label: '15%' },
    { amount: 5.0, label: '20%' },
    { amount: 7.0, label: '25%' },
  ];

  const currentTipAmount = isCustomMode ? parseFloat(customTip) || 0 : selectedTip;

  const handleSubmit = (tipToSubmit: number) => {
    onSubmit(rating, tipToSubmit, selectedCompliments, note);
  };

  return (
    <div
      id="tip-rating-modal-overlay"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-[#181716] border-t sm:border border-[#2E2B28] rounded-t-[28px] sm:rounded-3xl shadow-2xl p-5 max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col gap-4 text-[#e6e1df] animate-toast-in">
        {/* Top Handle */}
        <div className="flex justify-center -mt-1 mb-0 sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-[#363433]"></div>
        </div>

        {/* Close Button */}
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#211f1e] flex items-center justify-center text-[#a88a81] hover:text-white hover:bg-[#2b2a28] transition-colors active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Courier Identity Header */}
        <div className="flex flex-col items-center text-center mt-1">
          <div className="relative mb-2.5">
            <div className="w-20 h-20 rounded-full ring-4 ring-[#f36334]/40 p-0.5 shadow-lg bg-[#0f0e0d] overflow-hidden">
              <img
                alt={courier.name}
                className="w-full h-full rounded-full object-cover"
                src={courier.avatar}
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-[#f36334] text-white p-1 rounded-full shadow-md flex items-center justify-center ring-2 ring-[#181716]">
              <span className="material-symbols-outlined text-[14px]">verified</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            Delivered in 18 mins • On Time
          </div>

          <h3 className="font-headline-md text-[22px] font-bold text-white tracking-tight">
            {courier.name}
          </h3>
          <p className="text-xs text-[#a88a81]">
            {courier.vehicle} • {courier.badge}
          </p>
        </div>

        {/* Rate Experience Card */}
        <div className="bg-[#1c1b1a] border border-[#2b2a28] rounded-2xl p-4 text-center flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-white tracking-wider uppercase">
            Rate your courier experience
          </p>

          {/* 5 Stars */}
          <div className="flex items-center justify-center gap-2 my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-125 active:scale-95 transition-transform"
                title={`${star} star`}
              >
                <span
                  className="material-symbols-outlined text-[32px] text-[#ffba49]"
                  style={star <= rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  star
                </span>
              </button>
            ))}
          </div>

          <p className="text-xs font-bold text-[#ffba49]">
            {rating === 5 ? '5.0 Exceptional Service' : `${rating}.0 Good Service`}
          </p>

          {/* Compliments Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
            {complimentsList.map((comp) => {
              const isSelected = selectedCompliments.includes(comp);
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => toggleCompliment(comp)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#f36334]/20 border border-[#f36334] text-[#ffb59f]'
                      : 'bg-[#211f1e] text-[#a88a81] border border-white/5 hover:text-white'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip Section Card */}
        <div className="bg-[#1c1b1a] border border-[#2b2a28] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-white">Add a tip for {courier.name.split(' ')[0]}</span>
              <span className="text-[11px] text-[#a88a81]">100% of tips go directly to your courier</span>
            </div>
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">
              volunteer_activism
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {tipPresets.map((preset) => {
              const isActive = !isCustomMode && selectedTip === preset.amount;
              return (
                <button
                  key={preset.amount}
                  type="button"
                  onClick={() => {
                    setIsCustomMode(false);
                    setSelectedTip(preset.amount);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all active:scale-95 relative ${
                    isActive
                      ? 'bg-[#f36334] border-2 border-[#ffb59f] text-white shadow-md shadow-[#f36334]/30'
                      : 'bg-[#211f1e] border border-white/5 hover:bg-[#2b2a28] text-neutral-200'
                  }`}
                >
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1 bg-white text-[#f36334] rounded-full p-0.5 shadow-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                    </div>
                  )}
                  <span className="text-sm font-bold font-mono">${preset.amount.toFixed(2)}</span>
                  <span className={`text-[10px] ${isActive ? 'text-white/90' : 'text-[#a88a81]'}`}>
                    {preset.label}
                  </span>
                </button>
              );
            })}

            {/* Custom Tip */}
            <button
              type="button"
              onClick={() => {
                setIsCustomMode(true);
                if (!customTip) setCustomTip('6.00');
              }}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all active:scale-95 ${
                isCustomMode
                  ? 'bg-[#f36334] border-2 border-[#ffb59f] text-white shadow-md'
                  : 'bg-[#211f1e] border border-white/5 hover:bg-[#2b2a28] text-neutral-200'
              }`}
            >
              <span className="text-xs font-bold">Custom</span>
              <span className={`text-[10px] ${isCustomMode ? 'text-white/90' : 'text-[#a88a81]'}`}>
                {isCustomMode && customTip ? `$${customTip}` : 'Other'}
              </span>
            </button>
          </div>

          {isCustomMode && (
            <div className="flex items-center gap-2 bg-[#0f0e0d] px-3 py-2 rounded-xl border border-[#f36334]/50">
              <span className="text-sm font-bold text-[#f36334]">$</span>
              <input
                type="number"
                step="0.50"
                min="0"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder="Enter custom tip amount"
                className="w-full bg-transparent text-sm text-white focus:outline-none font-mono font-bold"
                autoFocus
              />
            </div>
          )}

          {/* Optional Note */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Add a note of thanks for ${courier.name.split(' ')[0]}... (optional)`}
              className="w-full bg-[#0f0e0d] text-white placeholder:text-[#a88a81] text-xs py-2.5 px-3.5 rounded-xl border border-[#2b2a28] focus:outline-none focus:border-[#f36334] transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1 pb-safe">
          <button
            type="button"
            onClick={() => handleSubmit(currentTipAmount)}
            className="w-full py-3.5 px-4 rounded-full bg-[#f36334] hover:bg-[#d44c20] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#f36334]/40 hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">favorite</span>
            <span>Submit Rating &amp; ${currentTipAmount.toFixed(2)} Tip</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(0)}
            className="w-full py-2 text-center text-[#a88a81] hover:text-white text-xs font-semibold transition-colors"
          >
            Skip tip &amp; submit rating
          </button>
        </div>
      </div>
    </div>
  );
};
