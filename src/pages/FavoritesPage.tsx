import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { DISHES } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { OrderCustomizerModal } from '@/components/OrderCustomizerModal';
import type { Dish, SizeOption, ToppingOption } from '@/types';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');
  const { favoriteRestaurantIds, favoriteDishIds, toggleFavoriteRestaurant, toggleFavoriteDish } = useFavorites();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);

  const favoritedRestaurants = RESTAURANTS.filter(r => favoriteRestaurantIds.includes(r.id));
  const favoritedDishes = DISHES.filter(d => favoriteDishIds.includes(d.id));

  const handleCustomizerAddToCart = (
    dish: Dish,
    quantity: number,
    instructions: string,
    customization: { size: SizeOption; toppings: ToppingOption[]; unitPrice: number }
  ) => {
    addItem(dish, dish.restaurant_id, dish.restaurantName, quantity, instructions, customization);
    showToast(`Added ${quantity}x ${dish.name} to your bag! 🛒`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-32 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-[#141312]/95 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-xl font-bold text-white">Your Saved Favorites</h1>
        <p className="text-xs text-[#a88a81] mt-0.5">Quick access to your preferred food and dining spots</p>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-4 bg-[#1c1b1a] p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'restaurants'
                ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/20'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            <span>Kitchens &bull; {favoritedRestaurants.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'dishes'
                ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/20'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            <span>Dishes &bull; {favoritedDishes.length}</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          favoritedRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-3 block">❤️</span>
              <h3 className="text-base font-bold text-white mb-1">No Favorite Restaurants Yet</h3>
              <p className="text-xs text-[#a88a81] max-w-xs mb-5">
                Click the heart icon on any restaurant card to save your favorite dining spots here.
              </p>
              <Link to="/" className="px-6 py-2.5 rounded-full bg-[#f36334] text-white text-xs font-bold">
                Discover Restaurants
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoritedRestaurants.map(r => (
                <div key={r.id} className="bg-[#1c1b1a] rounded-3xl overflow-hidden border border-white/5 relative group hover:border-white/15 transition-all shadow-md">
                  <button
                    onClick={() => {
                      toggleFavoriteRestaurant(r.id);
                      showToast(`Removed ${r.name} from Favorites`, 'info');
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-[#f36334] hover:scale-110 active:scale-95 transition-all"
                    title="Remove from favorites"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </button>

                  <Link to={`/restaurant/${r.slug}`} className="block">
                    <div className="h-40 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={r.cover_image}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-base leading-tight truncate">{r.name}</h3>
                        <span className="text-xs font-bold text-[#ffba49] flex items-center gap-1">
                          ★ {r.rating}
                        </span>
                      </div>
                      <p className="text-xs text-[#a88a81] truncate">{r.cuisine.join(', ')}</p>
                      <div className="flex items-center gap-3 text-xs text-[#a88a81] pt-1">
                        <span>{r.delivery_time_min}-{r.delivery_time_max} mins</span>
                        <span>&bull;</span>
                        <span>{r.delivery_fee === 0 ? 'Free Delivery' : formatPrice(r.delivery_fee)}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )
        )}

        {/* Dishes Tab */}
        {activeTab === 'dishes' && (
          favoritedDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-3 block">🍜</span>
              <h3 className="text-base font-bold text-white mb-1">No Favorite Dishes Saved</h3>
              <p className="text-xs text-[#a88a81] max-w-xs mb-5">
                Save dishes you love to re-order them in seconds anytime.
              </p>
              <Link to="/search" className="px-6 py-2.5 rounded-full bg-[#f36334] text-white text-xs font-bold">
                Search Dishes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favoritedDishes.map(d => (
                <div key={d.id} className="bg-[#1c1b1a] p-3.5 rounded-3xl border border-white/5 flex gap-3 relative hover:border-white/10 transition-all">
                  <img src={d.image} alt={d.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs">{d.is_veg ?? d.isVeg ? '🟢' : '🔴'}</span>
                      <span className="text-[10px] text-[#a88a81] uppercase font-bold">{d.category}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm truncate">{d.name}</h4>
                    <p className="text-[11px] text-[#a88a81] truncate">{d.restaurantName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-sm font-bold text-[#f36334]">{formatPrice(d.price)}</span>
                      <button
                        onClick={() => setCustomizingDish(d)}
                        className="px-3 py-1 rounded-xl bg-[#f36334] hover:bg-[#d44c20] text-white text-xs font-bold active:scale-95 shadow-sm shadow-[#f36334]/20"
                      >
                        ADD +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      toggleFavoriteDish(d.id);
                      showToast(`Removed ${d.name} from Favorites`, 'info');
                    }}
                    className="absolute top-3 right-3 text-[#f36334] hover:text-[#ffb59f]"
                    title="Remove from favorites"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )
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
