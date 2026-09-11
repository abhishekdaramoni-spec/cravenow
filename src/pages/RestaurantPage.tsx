import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { getDishesByRestaurant } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { OrderCustomizerModal } from '@/components/OrderCustomizerModal';
import type { Dish, SizeOption, ToppingOption } from '@/types';

function DishCard({
  dish,
  onOpenCustomize,
  isFavorite,
  onToggleFavorite,
}: {
  dish: Dish;
  onOpenCustomize: (d: Dish) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div
      onClick={() => dish.is_available && onOpenCustomize(dish)}
      className="flex items-start gap-3 p-3.5 bg-[#1c1b1a] rounded-2xl border border-white/5 hover:border-white/15 cursor-pointer transition-all active:scale-[0.99] group"
    >
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{dish.is_veg ?? dish.isVeg ? '🟢' : '🔴'}</span>
          {dish.is_bestseller && (
            <span className="px-2 py-0.5 rounded-full bg-[#f36334]/20 text-[#ffb59f] text-[10px] font-bold uppercase tracking-wider">
              Bestseller
            </span>
          )}
          {dish.badge && !dish.is_bestseller && (
            <span className="px-2 py-0.5 rounded-full bg-[#211f1e] text-[#ffba49] text-[10px] font-bold">
              {dish.badge}
            </span>
          )}
        </div>
        <h4 className="font-bold text-white text-sm leading-snug group-hover:text-[#ffb59f] transition-colors">{dish.name}</h4>
        <p className="text-[11px] text-[#a88a81] line-clamp-2 leading-relaxed">{dish.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-sm text-[#f36334] font-mono">{formatPrice(dish.price)}</span>
          {dish.original_price && (
            <span className="text-xs text-[#a88a81] line-through font-mono">{formatPrice(dish.original_price)}</span>
          )}
        </div>
        {dish.rating > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-[#a88a81] mt-0.5">
            <span className="material-symbols-outlined text-[13px] text-[#ffba49]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-[#ffba49] font-bold">{dish.rating}</span>
            <span>({dish.rating_count || 48})</span>
          </div>
        )}
      </div>

      {/* Image & Action */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#211f1e] shadow-md">
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(dish.id);
            }}
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:text-[#f36334] transition-colors"
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={isFavorite ? { color: '#f36334', fontVariationSettings: "'FILL' 1" } : undefined}
            >
              favorite
            </span>
          </button>
          {!dish.is_available && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
              <span className="text-[10px] text-white font-bold bg-neutral-800 px-2 py-0.5 rounded">Sold Out</span>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenCustomize(dish);
          }}
          disabled={!dish.is_available}
          className={`w-24 sm:w-28 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm ${
            dish.is_available
              ? 'bg-[#f36334] text-white hover:bg-[#d44c20] shadow-[#f36334]/20'
              : 'bg-[#2b2a28] text-[#a88a81] cursor-not-allowed'
          }`}
        >
          <span>ADD</span>
          <span className="text-[10px] opacity-75">+</span>
        </button>
      </div>
    </div>
  );
}

export default function RestaurantPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, items, subtotal, conflictRestaurant, resolveConflict } = useCart();
  const { showToast } = useToast();
  const { isRestaurantFavorite, toggleFavoriteRestaurant, isDishFavorite, toggleFavoriteDish } = useFavorites();

  const [menuSearch, setMenuSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);

  const restaurant = RESTAURANTS.find(r => r.slug === slug);
  const allDishes = restaurant ? getDishesByRestaurant(restaurant.id) : [];

  const categories = useMemo(() => {
    return [...new Set(allDishes.map(d => d.category))];
  }, [allDishes]);

  const filteredDishes = useMemo(() => {
    let dishes = allDishes;
    if (activeCategory) dishes = dishes.filter(d => d.category === activeCategory);
    if (showVegOnly) dishes = dishes.filter(d => d.is_veg ?? d.isVeg);
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      dishes = dishes.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    return dishes;
  }, [allDishes, activeCategory, showVegOnly, menuSearch]);

  const handleCustomizerAddToCart = (
    dish: Dish,
    quantity: number,
    instructions: string,
    customization: { size: SizeOption; toppings: ToppingOption[]; unitPrice: number }
  ) => {
    if (!restaurant) return;
    addItem(dish, restaurant.id, restaurant.name, quantity, instructions, customization);
    showToast(`Added ${quantity}x ${dish.name} to your feast! 🛒`, 'success');
  };

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4 text-center">
        <span className="material-symbols-outlined text-[54px] text-[#363433]">store_mall_directory</span>
        <h2 className="text-lg font-bold text-white">Restaurant Not Found</h2>
        <p className="text-xs text-[#a88a81] max-w-xs">The restaurant you are looking for might have moved or is temporarily unavailable.</p>
        <Link to="/" className="px-5 py-2.5 rounded-full bg-[#f36334] text-white text-xs font-bold hover:bg-[#d44c20] transition-colors mt-2">
          Browse All Restaurants
        </Link>
      </div>
    );
  }

  const bestsellers = allDishes.filter(d => d.is_bestseller);
  const isFav = isRestaurantFavorite(restaurant.id);

  return (
    <div className="flex flex-col w-full pb-32 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="relative w-full h-56 sm:h-72 bg-[#0f0e0d] overflow-hidden">
        <img src={restaurant.cover_image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-[#141312]/50 to-transparent" />
        
        {/* Navigation & Favorite controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <button
            onClick={() => {
              const nowFav = toggleFavoriteRestaurant(restaurant.id);
              showToast(nowFav ? `Added ${restaurant.name} to Favorites ❤️` : `Removed ${restaurant.name} from Favorites`);
            }}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ color: isFav ? '#f36334' : '#ffffff', fontVariationSettings: isFav ? "'FILL' 1" : undefined }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Restaurant Header Details */}
        <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <img src={restaurant.logo} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-[#141312] shadow-xl flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white font-extrabold text-xl sm:text-2xl leading-tight truncate">
                  {restaurant.name}
                </span>
                {restaurant.is_veg && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Pure Veg
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 truncate">{restaurant.cuisine.join(' • ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="px-4 py-3 bg-[#1c1b1a] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#ffba49] font-bold">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            {restaurant.rating} ({restaurant.rating_count} ratings)
          </span>
          <span className="text-[#a88a81] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            {restaurant.delivery_time_min}-{restaurant.delivery_time_max} mins
          </span>
          <span className="text-[#a88a81] hidden sm:flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">moped</span>
            {restaurant.delivery_fee === 0 ? <span className="text-emerald-400 font-bold">Free Delivery</span> : formatPrice(restaurant.delivery_fee)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#a88a81] truncate">{restaurant.address}</span>
        </div>
      </div>

      {/* Special Offers & Book Table banner */}
      <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {restaurant.offers.map((offer, i) => (
          <div key={i} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1c1b1a] border border-[#f36334]/25 flex-shrink-0">
            <span className="material-symbols-outlined text-[#f36334] text-[18px]">local_offer</span>
            <span className="text-xs text-[#ffb59f] font-semibold whitespace-nowrap">{offer}</span>
          </div>
        ))}
        <Link
          to={`/booking/${restaurant.slug}`}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#f36334]/25 to-[#ffba49]/15 border border-[#ffba49]/30 hover:border-[#ffba49]/60 flex-shrink-0 transition-colors"
        >
          <span className="material-symbols-outlined text-[#ffba49] text-[18px]">table_restaurant</span>
          <span className="text-xs text-[#ffba49] font-bold whitespace-nowrap">Reserve Table</span>
        </Link>
      </div>

      {/* Menu Search & Veg Filter */}
      <div className="px-4 py-2 flex items-center gap-2 sticky top-16 z-20 bg-[#141312]/95 backdrop-blur-md py-2 border-b border-white/5">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a88a81] text-[18px]">search</span>
          <input
            type="text"
            value={menuSearch}
            onChange={e => setMenuSearch(e.target.value)}
            placeholder="Search within this menu..."
            className="w-full bg-[#1c1b1a] text-white placeholder:text-[#a88a81] text-xs py-2.5 pl-10 pr-3 rounded-full border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#f36334]"
          />
        </div>
        <button
          onClick={() => setShowVegOnly(!showVegOnly)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
            showVegOnly
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              : 'bg-[#1c1b1a] text-[#a88a81] border border-white/5 hover:text-white'
          }`}
        >
          <span>🟢</span>
          <span>Veg Only</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            !activeCategory ? 'bg-[#f36334] text-white shadow-sm' : 'bg-[#1c1b1a] text-[#a88a81] border border-white/5 hover:text-white'
          }`}
        >
          All ({allDishes.length})
        </button>
        {categories.map(cat => {
          const count = allDishes.filter(d => d.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-[#f36334] text-white shadow-sm' : 'bg-[#1c1b1a] text-[#a88a81] border border-white/5 hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Bestsellers Section */}
      {!activeCategory && !menuSearch && bestsellers.length > 0 && (
        <section className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#ffba49] text-[20px]">auto_awesome</span>
            <h3 className="font-bold text-white text-base">Crowd Favorites</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bestsellers.map(dish => (
              <DishCard
                key={dish.id}
                dish={dish}
                onOpenCustomize={setCustomizingDish}
                isFavorite={isDishFavorite(dish.id)}
                onToggleFavorite={toggleFavoriteDish}
              />
            ))}
          </div>
        </section>
      )}

      {/* Full Menu Grouped by Category */}
      <section className="px-4 pt-4 flex flex-col gap-5">
        {activeCategory || menuSearch ? (
          <>
            <h3 className="font-bold text-white text-sm">
              {filteredDishes.length} {activeCategory || 'dishes'} {menuSearch ? `for "${menuSearch}"` : ''}
            </h3>
            {filteredDishes.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2 text-center">
                <span className="material-symbols-outlined text-[42px] text-[#363433]">search_off</span>
                <p className="text-sm text-[#a88a81]">No matching dishes found in this menu</p>
                <button
                  onClick={() => { setMenuSearch(''); setActiveCategory(null); setShowVegOnly(false); }}
                  className="text-xs text-[#f36334] font-bold mt-1"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDishes.map(dish => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onOpenCustomize={setCustomizingDish}
                    isFavorite={isDishFavorite(dish.id)}
                    onToggleFavorite={toggleFavoriteDish}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          categories.map(cat => {
            const catDishes = allDishes.filter(d => d.category === cat && !d.is_bestseller);
            if (catDishes.length === 0) return null;
            return (
              <div key={cat} className="space-y-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span>{cat}</span>
                  <span className="text-xs text-[#a88a81] font-normal">({catDishes.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {catDishes.map(dish => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onOpenCustomize={setCustomizingDish}
                      isFavorite={isDishFavorite(dish.id)}
                      onToggleFavorite={toggleFavoriteDish}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Floating Bottom Cart Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-16 inset-x-4 sm:bottom-6 sm:max-w-md sm:mx-auto z-40 animate-toast-in">
          <Link
            to="/cart"
            className="flex items-center justify-between bg-[#f36334] hover:bg-[#d44c20] text-white p-3.5 rounded-2xl shadow-xl shadow-[#f36334]/30 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xs">View Bag &bull; {formatPrice(subtotal)}</span>
                <span className="text-[10px] text-white/80 truncate max-w-[180px]">From {restaurant.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold">
              <span>Checkout</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </Link>
        </div>
      )}

      {/* Conflict Modal when adding from a different kitchen */}
      {conflictRestaurant.isConflict && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1b1a] border border-white/10 p-5 rounded-3xl max-w-sm w-full space-y-4 text-center">
            <span className="text-3xl block">🍲</span>
            <h3 className="font-bold text-base text-white">Replace Cart Items?</h3>
            <p className="text-xs text-[#a88a81] leading-relaxed">
              Your bag currently contains dishes from another restaurant. CraveNow orders are delivered hot and fresh from one kitchen at a time.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => resolveConflict(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#211f1e] text-xs font-semibold text-white hover:bg-[#2b2a28]"
              >
                Keep Current
              </button>
              <button
                onClick={() => resolveConflict(true)}
                className="flex-1 py-2.5 rounded-xl bg-[#f36334] text-xs font-bold text-white hover:bg-[#d44c20]"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

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
