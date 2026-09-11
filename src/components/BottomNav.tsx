import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavProps {
  cartCount?: number;
}

export function BottomNav({ cartCount = 0 }: BottomNavProps) {
  const location = useLocation();

  // Hide on tracking and checkout pages
  if (location.pathname.startsWith('/tracking') || location.pathname === '/checkout') {
    return null;
  }

  const tabs = [
    { path: '/', label: 'Home', icon: 'restaurant' },
    { path: '/search', label: 'Search', icon: 'search' },
    { path: '/orders', label: 'Orders', icon: 'receipt_long' },
    { path: '/favorites', label: 'Favorites', icon: 'favorite' },
    { path: '/profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#141312]/90 backdrop-blur-xl border-t border-[#2b2a28]/60 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-5xl mx-auto px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] relative transition-colors touch-manipulation active:scale-95 ${
                isActive ? 'text-[#f36334]' : 'text-[#a88a81] hover:text-[#e6e1df]'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[24px]`}
                  style={isActive && tab.icon === 'favorite' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                {tab.path === '/orders' && cartCount > 0 && !isActive && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#f36334] animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
