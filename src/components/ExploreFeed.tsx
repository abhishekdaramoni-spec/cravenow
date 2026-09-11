import React, { useState } from 'react';
import { Dish, CartItem, ScreenType } from '../types';
import { DISHES, CATEGORIES, FILTER_CHIPS } from '../data/mockData';

interface ExploreFeedProps {
  onOpenCustomizer: (dish: Dish) => void;
  onNavigate: (screen: ScreenType) => void;
  cart: CartItem[];
  hasActiveOrder: boolean;
  onToast: (msg: string) => void;
}

export const ExploreFeed: React.FC<ExploreFeedProps> = ({
  onOpenCustomizer,
  onNavigate,
  cart,
  hasActiveOrder,
  onToast,
}) => {
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [activeCategory, setActiveCategory] = useState<string>('burgers');
  const [activeFilter, setActiveFilter] = useState<string>('top-rated');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'dish-1': true,
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = !prev[id];
      onToast(next ? 'Saved to your Favorites ❤️' : 'Removed from Favorites');
      return { ...prev, [id]: next };
    });
  };

  const filteredDishes = DISHES.filter((dish) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return dish.name.toLowerCase().includes(q) || dish.description.toLowerCase().includes(q);
    }
    if (activeCategory === 'burgers') return dish.category === 'Burgers';
    if (activeCategory === 'pizza') return dish.category === 'Artisan Pizza';
    if (activeCategory === 'ramen') return dish.category === 'Ramen & Broth';
    if (activeCategory === 'drinks') return dish.category === 'Drinks';
    return true;
  });

  const cartTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col w-full pb-24 text-[#e6e1df]">
      {/* Sub-Header & Delivery Toggle Area */}
      <section className="px-3 sm:px-4 py-2 flex flex-col gap-2.5 bg-[#141312]">
        {/* Delivery Address Quick Select */}
        <div className="flex items-center justify-between bg-[#1c1b1a] px-3.5 py-1.5 rounded-full shadow-sm border border-white/5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#f36334] text-[20px] flex-shrink-0">
              near_me
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#e1bfb5] leading-none uppercase font-bold tracking-wider">
                Delivering to
              </span>
              <span className="text-xs font-bold text-white truncate">123 Main St, Apt 4B</span>
            </div>
          </div>
          <button 
            onClick={() => onToast('Delivery address updated: 123 Main St, Apt 4B')}
            className="flex items-center gap-0.5 px-2.5 py-1 bg-[#2b2a28] hover:bg-[#363433] rounded-full text-white transition-colors text-[11px] font-semibold"
          >
            <span>Change</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
        </div>

        {/* Segmented Control: Delivery vs Pickup */}
        <div className="grid grid-cols-2 p-1 bg-[#0f0e0d] rounded-full gap-1 border border-white/5">
          <button
            onClick={() => setDeliveryMode('delivery')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-full font-bold text-xs transition-all duration-200 min-h-[40px] ${
              deliveryMode === 'delivery'
                ? 'bg-[#f36334] text-white shadow-sm shadow-[#f36334]/30'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">moped</span>
            <span>Delivery</span>
          </button>
          <button
            onClick={() => setDeliveryMode('pickup')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-full font-bold text-xs transition-all duration-200 min-h-[40px] ${
              deliveryMode === 'pickup'
                ? 'bg-[#f36334] text-white shadow-sm shadow-[#f36334]/30'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Pickup &amp; Dine-In</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#a88a81]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#1c1b1a] text-white placeholder:text-[#a88a81] pl-10 pr-20 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#f36334] border border-white/5 transition-all"
            placeholder="Search craft burgers, ramen, artisan pizza..."
          />
          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#a88a81] hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <button 
              onClick={() => onNavigate('search')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#211f1e] text-[#f36334] hover:bg-[#2b2a28] transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter Chips Horizontal Scroll */}
      <section className="w-full overflow-x-auto custom-scrollbar py-2 px-3 sm:px-4 flex items-center gap-2">
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#f36334]/20 text-[#ffb59f] border border-[#f36334]/50 shadow-sm'
                  : 'bg-[#211f1e] text-neutral-300 border border-white/5 hover:bg-[#2b2a28]'
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          );
        })}
      </section>

      {/* Promotional Banner Carousel */}
      <section className="px-3 sm:px-4 pt-1 pb-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f36334] to-[#c18511] text-white p-4 shadow-lg">
          <div className="flex flex-col max-w-[65%] z-10 relative gap-1">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-[#ffba49] text-[10px] font-bold uppercase tracking-wider">
                Limited Offer
              </span>
              <span className="text-[11px] text-white/90 flex items-center gap-0.5 font-medium">
                <span className="material-symbols-outlined text-[14px]">timer</span> 2h left
              </span>
            </div>
            <h2 className="font-headline-md font-extrabold leading-tight text-white mt-0.5">
              30% OFF First Feasts
            </h2>
            <p className="text-xs text-white/90 line-clamp-1">
              Use code <span className="font-bold underline tracking-wider">CRAVE30</span> on artisan dishes
            </p>
            <div className="pt-2">
              <button
                onClick={() => onToast('Coupon CRAVE30 copied! 30% discount applied')}
                className="px-3.5 py-1.5 bg-[#141312] text-[#ffb59f] hover:text-white rounded-full text-xs font-bold shadow-md hover:scale-95 transition-transform"
              >
                Claim Feast
              </button>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-black/20 flex items-center justify-center pointer-events-none">
            <span className="text-6xl select-none">🍔</span>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Scroller */}
      <section className="pt-1 pb-3">
        <div className="px-3 sm:px-4 flex items-center justify-between mb-2">
          <h3 className="font-headline-sm font-bold text-white text-sm">Craving Categories</h3>
          <button 
            onClick={() => setActiveCategory('all')} 
            className="text-xs font-bold text-[#f36334] hover:underline"
          >
            See all (14)
          </button>
        </div>
        <div className="w-full overflow-x-auto custom-scrollbar px-3 sm:px-4 flex items-center gap-3">
          {CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group select-none active:scale-95 transition-transform"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-sm ${
                    isCatActive
                      ? 'bg-[#f36334] ring-2 ring-[#ffb59f]/50 text-white'
                      : 'bg-[#1c1b1a] hover:bg-[#2b2a28] border border-white/5 text-neutral-200'
                  }`}
                >
                  {cat.icon}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCatActive ? 'text-[#f36334] font-bold' : 'text-[#a88a81]'
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Menu Discovery Feed: Featured Dishes */}
      <section className="px-3 sm:px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="font-headline-md font-extrabold text-white text-base">Curated For Tonight</h3>
            <p className="text-xs text-[#a88a81]">Top-voted kitchens in your delivery radius</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#211f1e] text-[#ffba49] text-[11px] font-bold flex items-center gap-1 border border-white/5">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Chef Picks
          </span>
        </div>

        {/* Dishes list */}
        {filteredDishes.map((dish) => {
          const isFav = !!favorites[dish.id];
          return (
            <div
              key={dish.id}
              className="flex flex-col bg-[#1c1b1a] rounded-2xl overflow-hidden shadow-md group border border-white/5 transition-all hover:border-white/15"
            >
              {/* Photo Banner */}
              <div className="relative w-full h-48 bg-[#211f1e] overflow-hidden cursor-pointer" onClick={() => onOpenCustomizer(dish)}>
                <img
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={dish.image}
                />
                {/* Top Left Tags */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#ffba49] text-[11px] font-bold flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {dish.rating} ({dish.reviewsCount}+)
                  </span>
                  {dish.badge && (
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#ffb59f] text-[11px] font-bold">
                      {dish.badge}
                    </span>
                  )}
                </div>

                {/* Top Right Favorite Button */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => toggleFavorite(dish.id, e)}
                    className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:text-[#f36334] transition-colors active:scale-90"
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isFav ? 'text-[#f36334]' : ''
                      }`}
                      style={isFav ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                {/* Bottom Badges */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#2b2a28]/90 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    {dish.prepTime}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#2b2a28]/90 backdrop-blur-sm text-[#ffb59f] text-[11px] font-medium">
                    {dish.deliveryFee}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div 
                  className="flex flex-col gap-0.5 min-w-0 cursor-pointer"
                  onClick={() => onOpenCustomizer(dish)}
                >
                  <span className="font-headline-sm font-bold text-white truncate text-sm">
                    {dish.name}
                  </span>
                  <p className="text-xs text-[#a88a81] line-clamp-1">{dish.description}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-bold text-sm text-[#f36334] font-mono">
                      ${dish.price.toFixed(2)}
                    </span>
                    {dish.originalPrice && (
                      <span className="text-xs text-[#a88a81] line-through font-mono">
                        ${dish.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add button */}
                <button
                  onClick={() => onOpenCustomizer(dish)}
                  className="w-11 h-11 rounded-full bg-[#f36334] text-white flex items-center justify-center shadow-lg hover:bg-[#d44c20] active:scale-95 transition-all flex-shrink-0"
                  title="Customize & Add to bag"
                >
                  <span className="material-symbols-outlined text-[22px]">add</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Floating Active Order / Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 inset-x-0 z-30 px-4 max-w-md mx-auto">
          <div className="bg-[#262320]/95 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-2xl flex items-center justify-between gap-3 animate-toast-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#f36334] text-white flex items-center justify-center font-bold text-xs">
                {cartCount}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">
                  View your Feast Bag
                </span>
                <span className="text-[11px] text-emerald-400 font-medium font-mono">
                  ${cartTotal.toFixed(2)} subtotal
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('tracker')}
              className="py-2 px-3.5 rounded-full bg-[#f36334] hover:bg-[#d44c20] text-white font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all"
            >
              <span>Track / Order</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
