import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  activeOrderActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, activeOrderActive = true }) => {
  // If we are in Courier Chat, the chat screen has its own bottom composer
  if (currentScreen === 'chat') {
    return null;
  }

  const tabs: { id: ScreenType; label: string; icon: string; badge?: boolean }[] = [
    { id: 'feed', label: 'Feed', icon: 'restaurant' },
    { id: 'search', label: 'Search', icon: 'search' },
    { id: 'tracker', label: 'Orders', icon: 'moped', badge: activeOrderActive },
    { id: 'favorites', label: 'Favorites', icon: 'favorite' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#141312]/90 backdrop-blur-xl border-t border-[#2b2a28]/60">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id || (tab.id === 'tracker' && currentScreen === 'receipt');
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] relative transition-colors touch-manipulation active:scale-95 ${
                isActive ? 'text-[#f36334]' : 'text-[#a88a81] hover:text-[#e6e1df]'
              }`}
            >
              <div className="relative">
                <span 
                  className={`material-symbols-outlined text-[24px] ${
                    isActive && tab.id === 'favorites' ? 'fill-1 text-[#f36334]' : ''
                  }`}
                  style={isActive && tab.id === 'favorites' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                {tab.badge && !isActive && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#f36334] animate-pulse"></span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
