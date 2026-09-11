import React from 'react';
import { ScreenType } from '../types';
import { APP_IMAGES } from '../data/mockData';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  activeOrderCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, activeOrderCount = 1 }) => {
  // If we're on Courier Chat screen, the chat screen has its own top header
  if (currentScreen === 'chat') {
    return null;
  }

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#141312]/85 backdrop-blur-xl pt-safe border-b border-[#2b2a28]/40">
      <div className="h-16 px-3 sm:px-4 flex items-center justify-between gap-2 max-w-md mx-auto w-full">
        {/* Logo & Brand Name */}
        <button 
          onClick={() => onNavigate('feed')}
          className="flex items-center gap-2 text-left active:scale-95 transition-transform"
        >
          <img
            alt="CraveNow Logo"
            className="h-8 w-8 rounded-lg object-contain bg-[#1c1b1a] p-0.5 border border-white/10"
            src={APP_IMAGES.logo}
          />
          <div className="flex flex-col">
            <span className="font-headline-sm font-bold text-white tracking-tight leading-tight">
              CraveNow
            </span>
            {currentScreen === 'receipt' && (
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Order Fulfilled
              </span>
            )}
          </div>
        </button>

        {/* Deliver To Location Selector */}
        <button 
          onClick={() => onNavigate('feed')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2b2a28]/60 hover:bg-[#2b2a28] max-w-[170px] min-h-[40px] touch-manipulation border border-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[#f36334] text-[18px]">location_on</span>
          <div className="flex flex-col text-left truncate">
            <span className="text-[10px] text-[#e1bfb5] uppercase leading-none font-bold tracking-wider">
              Deliver To
            </span>
            <span className="text-xs font-semibold text-white truncate">
              San Francisco, CA
            </span>
          </div>
          <span className="material-symbols-outlined text-[#e1bfb5] text-[16px]">keyboard_arrow_down</span>
        </button>

        {/* Profile Avatar & Active Order Chip */}
        <div className="flex items-center gap-2">
          {activeOrderCount > 0 && currentScreen !== 'tracker' && currentScreen !== 'receipt' && (
            <button
              onClick={() => onNavigate('tracker')}
              className="relative p-1.5 rounded-full bg-[#f36334]/20 text-[#f36334] hover:bg-[#f36334]/30 active:scale-90 transition-all border border-[#f36334]/30"
              title="View live delivery"
            >
              <span className="material-symbols-outlined text-[20px]">moped</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </button>
          )}

          <button
            onClick={() => onNavigate('profile')}
            className="w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-[#f36334]/40 hover:ring-[#f36334] active:scale-95 transition-all overflow-hidden"
            title="Profile & Settings"
          >
            <img
              alt="Alex Miller"
              className="w-full h-full rounded-full object-cover"
              src={APP_IMAGES.userProfile}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
