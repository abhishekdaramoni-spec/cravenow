import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { DISHES } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');
  const [favoriteRestaurants, setFavoriteRestaurants] = useState(RESTAURANTS.slice(0, 4));
  const [favoriteDishes, setFavoriteDishes] = useState(DISHES.slice(0, 6));

  const removeRestaurant = (id: string) => {
    setFavoriteRestaurants(prev => prev.filter(r => r.id !== id));
  };

  const removeDish = (id: string) => {
    setFavoriteDishes(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-24">
      <div className="p-4 sticky top-0 bg-[#141312] z-10 border-b border-[#1c1b1a]">
        <h1 className="text-2xl font-semibold mb-4">Your Favorites</h1>
        
        <div className="flex rounded-lg bg-[#1c1b1a] p-1">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'restaurants' ? 'bg-[#f36334] text-white' : 'text-[#a88a81]'
            }`}
          >
            Restaurants
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'dishes' ? 'bg-[#f36334] text-white' : 'text-[#a88a81]'
            }`}
          >
            Dishes
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'restaurants' ? (
          favoriteRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteRestaurants.map(restaurant => (
                <div key={restaurant.id} className="bg-[#1c1b1a] rounded-2xl overflow-hidden relative">
                  <button 
                    onClick={() => removeRestaurant(restaurant.id)}
                    className="absolute top-3 right-3 z-10 bg-[#141312]/80 p-2 rounded-full text-[#f36334]"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </button>
                  <Link to={`/restaurant/${restaurant.slug}`}>
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                        <span className="flex items-center gap-1 bg-[#141312] px-2 py-1 rounded-md text-sm">
                          <span className="material-symbols-outlined text-[14px] text-[#f36334]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {restaurant.rating}
                        </span>
                      </div>
                      <p className="text-[#a88a81] text-sm mb-3">{restaurant.cuisine.join(', ')}</p>
                      <div className="flex items-center gap-4 text-sm text-[#a88a81]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          {restaurant.deliveryTime} min
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#a88a81]">
              <span className="material-symbols-outlined text-6xl mb-4">favorite_border</span>
              <p>No favorite restaurants yet.</p>
            </div>
          )
        ) : (
          favoriteDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteDishes.map(dish => (
                <div key={dish.id} className="bg-[#1c1b1a] p-3 rounded-2xl flex gap-4 relative">
                  <img src={dish.image} alt={dish.name} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1 py-1">
                    <h3 className="font-medium pr-8">{dish.name}</h3>
                    <p className="text-[#f36334] font-medium mt-1">{formatPrice(dish.price)}</p>
                    <p className="text-[#a88a81] text-sm mt-1">{dish.restaurantName || 'Restaurant'}</p>
                  </div>
                  <button 
                    onClick={() => removeDish(dish.id)}
                    className="absolute top-4 right-4 text-[#f36334]"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#a88a81]">
              <span className="material-symbols-outlined text-6xl mb-4">favorite_border</span>
              <p>No favorite dishes yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
