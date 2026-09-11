import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCart();

  // Don't show header on tracking page (it has its own)
  if (location.pathname.startsWith('/tracking')) return null;

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#141312]/85 backdrop-blur-xl border-b border-[#2b2a28]/40">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-5xl mx-auto w-full">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
          <div className="h-9 w-9 rounded-xl bg-[#f36334] flex items-center justify-center shadow-lg shadow-[#f36334]/20">
            <span className="text-white font-black text-lg font-sans">C</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight leading-tight text-[15px]">
              CraveNow
            </span>
            <span className="text-[10px] text-[#a88a81] font-medium hidden sm:block">
              Food you&apos;ll love, delivered fast
            </span>
          </div>
        </Link>

        {/* Deliver To */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1b1a] hover:bg-[#2b2a28] max-w-[200px] min-h-[40px] border border-white/5 transition-colors">
          <span className="material-symbols-outlined text-[#f36334] text-[18px]">location_on</span>
          <div className="flex flex-col text-left truncate">
            <span className="text-[10px] text-[#a88a81] uppercase leading-none font-bold tracking-wider">
              Deliver To
            </span>
            <span className="text-xs font-semibold text-white truncate">
              Koramangala, Bangalore
            </span>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[16px]">keyboard_arrow_down</span>
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
