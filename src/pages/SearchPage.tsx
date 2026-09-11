import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { DISHES, searchDishes } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

const TRENDING_SEARCHES = ['Biryani', 'Pizza', 'Butter Chicken', 'Dosa', 'Burgers'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const restaurantResults = useMemo(() => {
    if (!query) return [];
    let results = RESTAURANTS.filter(r => 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
    );

    if (activeFilter === 'Veg Only') results = results.filter(r => r.isVeg);
    if (activeFilter === 'Fast Delivery') results = results.filter(r => r.delivery_time_max <= 30);
    return results;
  }, [query, activeFilter]);

  const dishResults = useMemo(() => {
    if (!query) return [];
    let results = searchDishes(query);

    if (activeFilter === 'Veg Only') results = results.filter(d => d.isVeg);
    if (activeFilter === 'Under ₹200') results = results.filter(d => d.price < 200);
    return results;
  }, [query, activeFilter]);

  const handleAddDish = (dish: any, e: React.MouseEvent) => {
    e.preventDefault();
    addItem(dish);
    showToast(`Added ${dish.name} to cart`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-24">
      <div className="sticky top-0 z-10 bg-[#141312] p-4 border-b border-[#1c1b1a]">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a88a81]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants, dishes..."
            className="w-full bg-[#1c1b1a] text-[#e6e1df] rounded-full py-3 pl-10 pr-4 outline-none focus:ring-1 focus:ring-[#f36334]"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a88a81]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto mt-4 pb-1 scrollbar-hide">
          {['All', 'Veg Only', 'Under ₹200', 'Fast Delivery'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-[#f36334] text-white' 
                  : 'bg-[#1c1b1a] text-[#a88a81]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {!query ? (
          <div>
            <h3 className="text-lg font-medium mb-3 text-[#a88a81]">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="flex items-center gap-2 bg-[#1c1b1a] px-4 py-2 rounded-full text-sm"
                >
                  <span className="material-symbols-outlined text-sm text-[#f36334]">trending_up</span>
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {restaurantResults.length === 0 && dishResults.length === 0 ? (
              <div className="text-center py-12 text-[#a88a81]">
                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <>
                {restaurantResults.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Restaurants</h2>
                    <div className="space-y-4">
                      {restaurantResults.map(restaurant => (
                        <Link 
                          key={restaurant.id} 
                          to={`/restaurant/${restaurant.slug}`}
                          className="flex gap-4 bg-[#1c1b1a] p-3 rounded-2xl active:scale-[0.98] transition-transform"
                        >
                          <img 
                            src={restaurant.image} 
                            alt={restaurant.name} 
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{restaurant.name}</h3>
                            <p className="text-sm text-[#a88a81] truncate">{restaurant.cuisine.join(', ')}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-[#a88a81]">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-[#f36334] text-[16px]">star</span>
                                {restaurant.rating}
                              </span>
                              <span>•</span>
                              <span>{restaurant.deliveryTime} min</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {dishResults.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Dishes</h2>
                    <div className="space-y-4">
                      {dishResults.map(dish => (
                        <div key={dish.id} className="flex gap-4 bg-[#1c1b1a] p-3 rounded-2xl relative">
                          <img 
                            src={dish.image} 
                            alt={dish.name} 
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-1">
                              <span className={`material-symbols-outlined text-[14px] ${dish.isVeg ? 'text-green-500' : 'text-red-500'}`}>
                                fiber_manual_record
                              </span>
                              <p className="text-xs text-[#a88a81] truncate">{dish.restaurantName || 'Restaurant'}</p>
                            </div>
                            <h3 className="font-semibold line-clamp-1">{dish.name}</h3>
                            <p className="text-[#f36334] font-medium mt-1">{formatPrice(dish.price)}</p>
                            
                            <button
                              onClick={(e) => handleAddDish(dish, e)}
                              className="absolute bottom-3 right-3 bg-[#f36334] text-white p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
                            >
                              <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
