import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useCart } from '@/contexts/CartContext';

export function MainLayout() {
  const location = useLocation();
  const { itemCount } = useCart();

  // Hide header/nav on certain pages
  const hideChrome = ['/checkout'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] flex flex-col font-sans">
      {!hideChrome && <Header />}

      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      {!hideChrome && <BottomNav cartCount={itemCount} />}
    </div>
  );
}
