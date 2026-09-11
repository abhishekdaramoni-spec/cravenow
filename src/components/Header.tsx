import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLocationContext } from '@/contexts/LocationContext';

export function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { currentLocation, openLocationModal } = useLocationContext();

  // Don't show header on tracking page (it has its own)
  if (location.pathname.startsWith('/tracking')) return null;

  const displayLocality = currentLocation?.locality || currentLocation?.city || 'Select Location';
  const displayAddress = currentLocation?.address || 'Set your delivery location';

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#141312]/85 backdrop-blur-xl border-b border-[#2b2a28]/40">
      <div className="h-16 px-3 sm:px-4 flex items-center justify-between gap-2 max-w-5xl mx-auto w-full">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 active:scale-95 transition-transform shrink-0">
          <div className="h-9 w-9 rounded-xl bg-[#f36334] flex items-center justify-center shadow-lg shadow-[#f36334]/20 shrink-0">
            <span className="text-white font-black text-lg font-sans">C</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight leading-tight text-[14px] sm:text-[15px]">
              CraveNow
            </span>
            <span className="text-[10px] text-[#a88a81] font-medium hidden md:block">
              Food you&apos;ll love, delivered fast
            </span>
          </div>
        </Link>

        {/* Deliver To Selector Button */}
        <button
          onClick={openLocationModal}
          type="button"
          title={`Delivery Location: ${displayAddress}`}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#1c1b1a] hover:bg-[#262422] active:scale-95 max-w-[145px] sm:max-w-[220px] md:max-w-[260px] min-h-[36px] sm:min-h-[40px] border border-white/5 hover:border-[#f36334]/40 transition-all cursor-pointer group"
          aria-label={`Current delivery location: ${displayLocality}. Click to change.`}
        >
          <span className="material-symbols-outlined text-[#f36334] text-[18px] sm:text-[20px] shrink-0 group-hover:scale-110 transition-transform">
            location_on
          </span>
          <div className="flex flex-col text-left truncate min-w-0">
            <span className="text-[9px] sm:text-[10px] text-[#a88a81] uppercase leading-none font-bold tracking-wider truncate flex items-center gap-1">
              Deliver To
              {currentLocation?.source === 'gps' && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" title="GPS Detected" />
              )}
            </span>
            <span className="text-xs font-semibold text-white truncate group-hover:text-[#f36334] transition-colors">
              {displayLocality}
            </span>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] group-hover:text-white text-[16px] shrink-0 transition-transform group-hover:translate-y-0.5">
            keyboard_arrow_down
          </span>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* AI Assistant */}
          <Link
            to="/ai"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#f36334]/20 to-[#ffba49]/10 text-[#ffba49] text-xs font-bold border border-[#ffba49]/20 hover:border-[#ffba49]/40 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>AI</span>
          </Link>

          {/* Cart indicator */}
          {itemCount > 0 && (
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-[#f36334]/15 text-[#f36334] hover:bg-[#f36334]/25 active:scale-90 transition-all border border-[#f36334]/30"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f36334] text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            </Link>
          )}

          {/* Profile */}
          <Link
            to={user ? '/profile' : '/login'}
            className="w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-[#f36334]/30 hover:ring-[#f36334] active:scale-95 transition-all overflow-hidden bg-[#1c1b1a]"
          >
            {user?.avatar_url ? (
              <img alt={user.full_name} className="w-full h-full rounded-full object-cover" src={user.avatar_url} />
            ) : (
              <span className="material-symbols-outlined text-[20px] text-[#a88a81]">person</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
