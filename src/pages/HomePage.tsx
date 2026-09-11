import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANTS, FOOD_CATEGORIES, FILTER_CHIPS } from '@/data/restaurants';
import { formatPrice } from '@/lib/constants';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/contexts/ToastContext';
import type { Restaurant } from '@/types';

function RestaurantCard({
  restaurant,
  isFavorite,
  onToggleFavorite,
}: {
  restaurant: Restaurant;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="relative flex flex-col bg-[#1c1b1a] rounded-3xl overflow-hidden shadow-md border border-white/5 transition-all hover:border-white/15 group">
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(restaurant.id);
        }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 hover:scale-105"
        title="Toggle Favorite"
      >
        <span
          className="material-symbols-outlined text-[18px]"
          style={{ color: isFavorite ? '#f36334' : '#ffffff', fontVariationSettings: isFavorite ? "'FILL' 1" : undefined }}
        >
          favorite
        </span>
      </button>

      <Link to={`/restaurant/${restaurant.slug}`} className="flex flex-col flex-1">
        {/* Cover Image */}
        <div className="relative w-full h-44 sm:h-52 bg-[#211f1e] overflow-hidden">
          <img
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={restaurant.cover_image}
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#ffba49] text-[11px] font-bold flex items-center gap-1">
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
              <span className="px-2.5 py-1 rounded-xl bg-[#f36334]/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                {restaurant.offers[0]}
              </span>
            </div>
          )}

          {/* Closed overlay */}
          {!restaurant.is_open && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-[#1c1b1a] text-[#a88a81] text-xs font-bold border border-white/10 shadow-lg">
                Currently Closed
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src={restaurant.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10 flex-shrink-0" loading="lazy" />
              <div className="min-w-0">
                <h3 className="font-bold text-white text-base truncate group-hover:text-[#ffb59f] transition-colors">
                  {restaurant.name}
                </h3>
                <p className="text-xs text-[#a88a81] truncate">{restaurant.cuisine.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#a88a81] pt-2 border-t border-white/5">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[15px] text-[#f36334]">schedule</span>
              {restaurant.delivery_time_min}-{restaurant.delivery_time_max} mins
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[15px] text-[#f36334]">moped</span>
              {restaurant.delivery_fee === 0 ? <span className="text-emerald-400 font-bold">Free</span> : formatPrice(restaurant.delivery_fee)}
            </span>
            <span className="text-neutral-400 font-medium">
              {'₹'.repeat(restaurant.price_level)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'delivery' | 'cost_low' | 'cost_high'>('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  const { isRestaurantFavorite, toggleFavoriteRestaurant } = useFavorites();
  const { showToast } = useToast();

  const handleToggleFav = (id: string) => {
    const isNow = toggleFavoriteRestaurant(id);
    const r = RESTAURANTS.find(x => x.id === id);
    showToast(isNow ? `Added ${r?.name || 'Restaurant'} to Favorites ❤️` : `Removed ${r?.name || 'Restaurant'} from Favorites`);
  };

  const filteredRestaurants = useMemo(() => {
    let results = [...RESTAURANTS];

    // Category filter
    if (activeCategory !== 'all') {
      const catMap: Record<string, string[]> = {
        'north-indian': ['North Indian', 'Mughlai'],
        'south-indian': ['South Indian'],
        chinese: ['Chinese'],
        italian: ['Italian', 'Pizza'],
        biryani: ['Biryani'],
        burgers: ['Burgers'],
        pizza: ['Pizza', 'Italian'],
        desserts: ['Desserts', 'Bakery'],
        healthy: ['Healthy'],
        'street-food': ['Street Food', 'Snacks'],
        beverages: ['Beverages', 'Chai'],
        rolls: ['Rolls & Wraps', 'Fast Food'],
      };
      const cuisines = catMap[activeCategory] || [];
      if (cuisines.length > 0) {
        results = results.filter(r => r.cuisine.some(c => cuisines.includes(c)));
      }
    }

    // Quick filter
    if (activeFilter === 'top-rated') results = results.filter(r => r.rating >= 4.5);
    if (activeFilter === 'fast-delivery') results = results.filter(r => r.delivery_time_max <= 30);
    if (activeFilter === 'offers') results = results.filter(r => r.offers.length > 0);
    if (activeFilter === 'pure-veg') results = results.filter(r => r.is_veg);
    if (activeFilter === 'budget') results = results.filter(r => r.price_level <= 1);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some(c => c.toLowerCase().includes(q)) ||
        r.popular_dishes.some(d => d.toLowerCase().includes(q))
      );
    }

    // Sorting
    results.sort((a, b) => {
      // Prioritize open restaurants
      if (a.is_open !== b.is_open) return a.is_open ? -1 : 1;

      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.delivery_time_min - b.delivery_time_min;
      if (sortBy === 'cost_low') return a.price_level - b.price_level;
      if (sortBy === 'cost_high') return b.price_level - a.price_level;
      return b.rating_count - a.rating_count;
    });

    return results;
  }, [activeCategory, activeFilter, sortBy, searchQuery]);

  return (
    <div className="flex flex-col w-full pb-32 max-w-6xl mx-auto">
      {/* Search Header Bar */}
      <section className="px-4 py-3 flex flex-col gap-3 bg-[#141312]">
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-[#a88a81]">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-[#1c1b1a] text-white placeholder:text-[#a88a81] pl-12 pr-24 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#f36334] border border-white/5 transition-all shadow-inner"
            placeholder="Search restaurants, cuisines, butter chicken, biryani..."
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#a88a81] hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <Link
              to="/search"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#211f1e] text-[#f36334] hover:bg-[#2b2a28] transition-colors"
              title="Advanced Search"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Filter Chips */}
      <section className="w-full overflow-x-auto no-scrollbar py-2 px-4 flex items-center gap-2">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(activeFilter === chip.id ? null : chip.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
              activeFilter === chip.id
                ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/25'
                : 'bg-[#1c1b1a] text-neutral-300 border border-white/5 hover:bg-[#211f1e]'
            }`}
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </section>

      {/* Hero Promo Banner */}
      <section className="px-4 py-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f36334] via-[#e65a2c] to-[#c18511] text-white p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col max-w-[70%] z-10 relative gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-[#ffba49] text-[10px] font-bold uppercase tracking-wider w-fit">
              Special Feast Offer
            </span>
            <h2 className="font-black leading-tight text-white text-xl sm:text-2xl mt-0.5">
              Flat 30% OFF Your First Feast
            </h2>
            <p className="text-xs sm:text-sm text-white/90">
              Apply code <span className="font-bold underline tracking-wider font-mono">CRAVE30</span> at checkout &bull; Min order ₹299
            </p>
          </div>
          <div className="absolute -right-4 -bottom-6 w-36 h-36 rounded-full bg-black/20 flex items-center justify-center pointer-events-none select-none text-7xl">
            🍛
          </div>
        </div>
      </section>

      {/* Food Category Carousel */}
      <section className="pt-2 pb-4">
        <div className="px-4 flex items-center justify-between mb-3">
          <h3 className="font-bold text-white text-base">What are you craving?</h3>
        </div>
        <div className="w-full overflow-x-auto no-scrollbar px-4 flex items-center gap-3">
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex flex-col items-center gap-2 flex-shrink-0 select-none active:scale-95 transition-transform"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-3xl transition-all shadow-md ${
                  activeCategory === cat.id
                    ? 'bg-[#f36334] ring-2 ring-white/30 text-white scale-105'
                    : 'bg-[#1c1b1a] hover:bg-[#211f1e] border border-white/5'
                }`}
              >
                {cat.icon}
              </div>
              <span className={`text-xs font-semibold ${activeCategory === cat.id ? 'text-[#f36334]' : 'text-[#a88a81]'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Header & Sorting Bar */}
      <section className="px-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
          <div>
            <h3 className="font-black text-white text-lg sm:text-xl">
              {activeCategory === 'all'
                ? 'Curated Dining Spots'
                : `${FOOD_CATEGORIES.find(c => c.id === activeCategory)?.name || ''} Kitchens`}
            </h3>
            <p className="text-xs text-[#a88a81]">{filteredRestaurants.length} kitchens ready to deliver to your door</p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#a88a81] font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1c1b1a] text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#f36334]"
            >
              <option value="relevance">Popularity / Relevance</option>
              <option value="rating">Top Rated (★)</option>
              <option value="delivery">Fastest Delivery</option>
              <option value="cost_low">Price: Low to High</option>
              <option value="cost_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <span className="material-symbols-outlined text-[54px] text-[#363433]">search_off</span>
            <h4 className="font-bold text-base text-white">No Kitchens Match Filters</h4>
            <p className="text-xs text-[#a88a81] max-w-xs">Try clearing your filters or search keywords to view all restaurants.</p>
            <button
              onClick={() => { setActiveCategory('all'); setActiveFilter(null); setSearchQuery(''); setSortBy('relevance'); }}
              className="px-6 py-2.5 rounded-full bg-[#f36334] text-white text-xs font-bold hover:bg-[#d44c20] transition-colors mt-2"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFavorite={isRestaurantFavorite(restaurant.id)}
                onToggleFavorite={handleToggleFav}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
