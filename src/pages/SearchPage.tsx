import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { searchDishes } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { OrderCustomizerModal } from '@/components/OrderCustomizerModal';
import type { Dish, SizeOption, ToppingOption } from '@/types';

const TRENDING_SEARCHES = ['Biryani', 'Butter Chicken', 'Pizza', 'Masala Dosa', 'Smash Burger', 'Tandoori', 'Chai'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { isRestaurantFavorite, toggleFavoriteRestaurant, isDishFavorite, toggleFavoriteDish } = useFavorites();
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const restaurantResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let results = RESTAURANTS.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.cuisine.some(c => c.toLowerCase().includes(q)) ||
      r.popular_dishes.some(d => d.toLowerCase().includes(q))
    );

    if (activeFilter === 'Veg Only') results = results.filter(r => r.is_veg ?? r.isVeg);
    if (activeFilter === 'Fast Delivery') results = results.filter(r => r.delivery_time_max <= 30);
    return results;
  }, [query, activeFilter]);

  const dishResults = useMemo(() => {
    if (!query.trim()) return [];
    let results = searchDishes(query);

    if (activeFilter === 'Veg Only') results = results.filter(d => d.is_veg ?? d.isVeg);
    if (activeFilter === 'Under ₹200') results = results.filter(d => d.price < 200);
    return results;
  }, [query, activeFilter]);

  const handleCustomizerAddToCart = (
    dish: Dish,
    quantity: number,
    instructions: string,
    customization: { size: SizeOption; toppings: ToppingOption[]; unitPrice: number }
  ) => {
    addItem(dish, dish.restaurant_id, dish.restaurantName, quantity, instructions, customization);
    showToast(`Added ${quantity}x ${dish.name} to bag! 🛒`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-32 max-w-4xl mx-auto">
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-20 bg-[#141312]/95 backdrop-blur-md p-4 border-b border-white/5 space-y-3">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-[#a88a81] text-[22px]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants, cuisines, butter chicken, biryani..."
            className="w-full bg-[#1c1b1a] text-white rounded-full py-3.5 pl-12 pr-12 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-[#f36334] border border-white/5 shadow-inner"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 text-[#a88a81] hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {['All', 'Veg Only', 'Under ₹200', 'Fast Delivery'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === filter 
                  ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/25' 
                  : 'bg-[#1c1b1a] text-[#a88a81] border border-white/5 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Trending Searches when input is empty */}
        {!query.trim() ? (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a88a81]">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="bg-[#1c1b1a] hover:bg-[#211f1e] border border-white/5 px-4 py-2 rounded-2xl text-xs font-semibold text-neutral-300 transition-colors flex items-center gap-1.5 active:scale-95"
                >
                  <span className="text-[#f36334]">🔥</span>
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Restaurant Results */}
            {restaurantResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">Restaurants ({restaurantResults.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {restaurantResults.map(r => (
                    <div key={r.id} className="bg-[#1c1b1a] rounded-2xl p-3 border border-white/5 flex gap-3 relative group hover:border-white/15 transition-all">
                      <Link to={`/restaurant/${r.slug}`} className="flex gap-3 flex-1 min-w-0">
                        <img src={r.cover_image} alt={r.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="font-bold text-white text-sm truncate group-hover:text-[#ffb59f]">{r.name}</h4>
                          <p className="text-[11px] text-[#a88a81] truncate">{r.cuisine.join(', ')}</p>
                          <div className="flex items-center gap-2 text-xs text-[#a88a81] mt-2">
                            <span className="text-[#ffba49] font-bold">★ {r.rating}</span>
                            <span>&bull;</span>
                            <span>{r.delivery_time_min}-{r.delivery_time_max} mins</span>
                          </div>
                        </div>
                      </Link>

                      <button
                        onClick={() => {
                          const nowFav = toggleFavoriteRestaurant(r.id);
                          showToast(nowFav ? `Added to favorites ❤️` : `Removed from favorites`);
                        }}
                        className="absolute top-3 right-3 text-[#f36334]"
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={isRestaurantFavorite(r.id) ? { fontVariationSettings: "'FILL' 1" } : { color: '#a88a81' }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dish Results */}
            {dishResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">Dishes ({dishResults.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dishResults.map(d => (
                    <div
                      key={d.id}
                      onClick={() => setCustomizingDish(d)}
                      className="bg-[#1c1b1a] p-3.5 rounded-2xl border border-white/5 flex gap-3 cursor-pointer hover:border-white/15 transition-all group relative"
                    >
                      <img src={d.image} alt={d.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs">{d.is_veg ?? d.isVeg ? '🟢' : '🔴'}</span>
                          <span className="text-[10px] text-[#a88a81] uppercase font-bold">{d.category}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm truncate group-hover:text-[#ffb59f]">{d.name}</h4>
                        <p className="text-[11px] text-[#a88a81] truncate">{d.restaurantName}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-mono text-sm font-bold text-[#f36334]">{formatPrice(d.price)}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomizingDish(d);
                            }}
                            className="px-3 py-1 rounded-xl bg-[#f36334] hover:bg-[#d44c20] text-white text-xs font-bold active:scale-95 shadow-sm shadow-[#f36334]/20"
                          >
                            ADD +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const nowFav = toggleFavoriteDish(d.id);
                          showToast(nowFav ? `Added to favorites ❤️` : `Removed from favorites`);
                        }}
                        className="absolute top-3 right-3 text-[#f36334]"
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={isDishFavorite(d.id) ? { fontVariationSettings: "'FILL' 1" } : { color: '#a88a81' }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zero results */}
            {restaurantResults.length === 0 && dishResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-[54px] text-[#363433] mb-2">search_off</span>
                <h3 className="text-base font-bold text-white mb-1">No Results for &ldquo;{query}&rdquo;</h3>
                <p className="text-xs text-[#a88a81] max-w-xs">Try searching for Biryani, Pizza, Butter Chicken, or Dosa Republic</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dish Customizer Modal */}
      <OrderCustomizerModal
        dish={customizingDish}
        isOpen={!!customizingDish}
        onClose={() => setCustomizingDish(null)}
        onAddToCart={handleCustomizerAddToCart}
      />
    </div>
  );
}
