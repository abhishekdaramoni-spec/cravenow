import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANTS, FOOD_CATEGORIES, FILTER_CHIPS } from '@/data/restaurants';
import { DISHES } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';
import type { Restaurant } from '@/types';

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant.slug}`}
      className="flex flex-col bg-[#1c1b1a] rounded-2xl overflow-hidden shadow-md border border-white/5 transition-all hover:border-white/15 group"
    >
      {/* Cover Image */}
      <div className="relative w-full h-44 sm:h-48 bg-[#211f1e] overflow-hidden">
        <img
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={restaurant.cover_image}
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#ffba49] text-[11px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            {restaurant.rating} ({restaurant.rating_count > 999 ? `${(restaurant.rating_count / 1000).toFixed(1)}k` : restaurant.rating_count})
          </span>
          {restaurant.is_veg && (
            <span className="px-2 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
              Pure Veg
            </span>
          )}
        </div>
        {/* Offers */}
        {restaurant.offers.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#f36334]/90 backdrop-blur-sm text-white text-[11px] font-bold">
              {restaurant.offers[0]}
            </span>
          </div>
        )}
        {/* Closed overlay */}
        {!restaurant.is_open && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-[#1c1b1a] text-[#a88a81] text-sm font-bold border border-white/10">
              Currently Closed
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={restaurant.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10 flex-shrink-0" loading="lazy" />
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm truncate">{restaurant.name}</h3>
              <p className="text-[11px] text-[#a88a81] truncate">{restaurant.cuisine.join(', ')}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#a88a81] mt-0.5">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {restaurant.delivery_time_min}-{restaurant.delivery_time_max} min
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">moped</span>
            {restaurant.delivery_fee === 0 ? <span className="text-emerald-400 font-bold">Free</span> : formatPrice(restaurant.delivery_fee)}
          </span>
          <span className="text-[#e1bfb5]">
            {'₹'.repeat(restaurant.price_level)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = useMemo(() => {
    let results = [...RESTAURANTS];

    // Category filter
    if (activeCategory !== 'all') {
      const catMap: Record<string, string[]> = {
        'north-indian': ['North Indian'], 'south-indian': ['South Indian'], chinese: ['Chinese'],
        italian: ['Italian'], biryani: ['Biryani'], burgers: ['Burgers'], pizza: ['Pizza'],
        desserts: ['Desserts'], healthy: ['Healthy'], 'street-food': ['Street Food'],
        beverages: ['Beverages'], rolls: ['Rolls & Wraps'],
      };
      const cuisines = catMap[activeCategory] || [];
      if (cuisines.length > 0) {
        results = results.filter(r => r.cuisine.some(c => cuisines.includes(c)));
      }
    }

    // Quick filter
    if (activeFilter === 'top-rated') results = results.filter(r => r.rating >= 4.3);
    if (activeFilter === 'fast-delivery') results = results.filter(r => r.delivery_time_max <= 30);
    if (activeFilter === 'offers') results = results.filter(r => r.offers.length > 0);
    if (activeFilter === 'pure-veg') results = results.filter(r => r.is_veg);
    if (activeFilter === 'budget') results = results.filter(r => r.price_level <= 1);

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some(c => c.toLowerCase().includes(q)) ||
        r.popular_dishes.some(d => d.toLowerCase().includes(q))
      );
    }

    // Sort: open first, then by rating
    results.sort((a, b) => {
      if (a.is_open !== b.is_open) return a.is_open ? -1 : 1;
      return b.rating - a.rating;
    });

    return results;
  }, [activeCategory, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Delivery Address + Search */}
      <section className="px-4 py-3 flex flex-col gap-3 bg-[#141312]">
        {/* Mobile delivery address */}
        <div className="flex sm:hidden items-center justify-between bg-[#1c1b1a] px-3.5 py-2 rounded-full border border-white/5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#f36334] text-[20px] flex-shrink-0">near_me</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#a88a81] leading-none uppercase font-bold tracking-wider">Delivering to</span>
              <span className="text-xs font-bold text-white truncate">Koramangala, Bangalore</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[16px]">expand_more</span>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-[#a88a81]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#1c1b1a] text-white placeholder:text-[#a88a81] pl-10 pr-20 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#f36334] border border-white/5 transition-all"
            placeholder="Search restaurants, cuisines, dishes..."
          />
          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="w-7 h-7 flex items-center justify-center rounded-full text-[#a88a81] hover:text-white">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <Link to="/search" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#211f1e] text-[#f36334] hover:bg-[#2b2a28] transition-colors">
              <span className="material-symbols-outlined text-[17px]">tune</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="w-full overflow-x-auto no-scrollbar py-2 px-4 flex items-center gap-2">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(activeFilter === chip.id ? null : chip.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
              activeFilter === chip.id
                ? 'bg-[#f36334]/20 text-[#ffb59f] border border-[#f36334]/50 shadow-sm'
                : 'bg-[#211f1e] text-neutral-300 border border-white/5 hover:bg-[#2b2a28]'
            }`}
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </section>

      {/* Promo Banner */}
      <section className="px-4 py-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f36334] to-[#c18511] text-white p-4 shadow-lg">
          <div className="flex flex-col max-w-[65%] z-10 relative gap-1">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-[#ffba49] text-[10px] font-bold uppercase tracking-wider">
                Limited Offer
              </span>
            </div>
            <h2 className="font-extrabold leading-tight text-white text-lg mt-0.5">
              30% OFF First Order
            </h2>
            <p className="text-xs text-white/90">
              Use code <span className="font-bold underline tracking-wider">CRAVE30</span> on any restaurant
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-black/20 flex items-center justify-center pointer-events-none">
            <span className="text-6xl select-none">🍛</span>
          </div>
        </div>
      </section>

      {/* Food Categories */}
      <section className="pt-1 pb-3">
        <div className="px-4 flex items-center justify-between mb-2">
          <h3 className="font-bold text-white text-sm">What are you craving?</h3>
        </div>
        <div className="w-full overflow-x-auto no-scrollbar px-4 flex items-center gap-3">
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 select-none active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-[#f36334] ring-2 ring-[#ffb59f]/50 text-white'
                  : 'bg-[#1c1b1a] hover:bg-[#2b2a28] border border-white/5'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-[11px] font-medium ${activeCategory === cat.id ? 'text-[#f36334] font-bold' : 'text-[#a88a81]'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base">
              {activeCategory === 'all' ? 'Restaurants near you' : `${FOOD_CATEGORIES.find(c => c.id === activeCategory)?.name || ''} Restaurants`}
            </h3>
            <p className="text-xs text-[#a88a81]">{filteredRestaurants.length} restaurants found</p>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined text-[48px] text-[#363433]">search_off</span>
            <p className="text-sm text-[#a88a81] text-center">No restaurants found matching your criteria</p>
            <button
              onClick={() => { setActiveCategory('all'); setActiveFilter(null); setSearchQuery(''); }}
              className="px-4 py-2 rounded-full bg-[#f36334] text-white text-xs font-bold hover:bg-[#d44c20] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
