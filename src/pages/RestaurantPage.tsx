import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { getDishesByRestaurant } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import type { Dish } from '@/types';

function DishCard({ dish, onAdd }: { dish: Dish; onAdd: (d: Dish) => void }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#1c1b1a] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{dish.is_veg ? '🟢' : '🔴'}</span>
          {dish.is_bestseller && (
            <span className="px-1.5 py-0.5 rounded bg-[#f36334]/20 text-[#ffb59f] text-[9px] font-bold uppercase">
              Bestseller
            </span>
          )}
          {dish.badge && !dish.is_bestseller && (
            <span className="px-1.5 py-0.5 rounded bg-[#211f1e] text-[#ffba49] text-[9px] font-bold">
              {dish.badge}
            </span>
          )}
        </div>
        <h4 className="font-bold text-white text-sm leading-tight">{dish.name}</h4>
        <p className="text-[11px] text-[#a88a81] line-clamp-2 leading-relaxed">{dish.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-bold text-sm text-[#f36334]">{formatPrice(dish.price)}</span>
          {dish.original_price && (
            <span className="text-xs text-[#a88a81] line-through">{formatPrice(dish.original_price)}</span>
          )}
        </div>
        {dish.rating > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-[#a88a81]">
            <span className="material-symbols-outlined text-[13px] text-[#ffba49]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-[#ffba49] font-bold">{dish.rating}</span>
            <span>({dish.rating_count})</span>
          </div>
        )}
      </div>

      {/* Image + Add */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#211f1e]">
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
          {!dish.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-[10px] text-[#a88a81] font-bold">Unavailable</span>
            </div>
          )}
        </div>
        <button
          onClick={() => onAdd(dish)}
          disabled={!dish.is_available}
          className={`w-24 sm:w-28 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
            dish.is_available
              ? 'bg-[#f36334] text-white hover:bg-[#d44c20] shadow-sm shadow-[#f36334]/20'
              : 'bg-[#363433] text-[#a88a81] cursor-not-allowed'
          }`}
        >
          ADD
        </button>
      </div>
    </div>
  );
}

export default function RestaurantPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [menuSearch, setMenuSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showVegOnly, setShowVegOnly] = useState(false);

  const restaurant = RESTAURANTS.find(r => r.slug === slug);
  const allDishes = restaurant ? getDishesByRestaurant(restaurant.id) : [];

  const categories = useMemo(() => {
    const cats = [...new Set(allDishes.map(d => d.category))];
    return cats;
  }, [allDishes]);

  const filteredDishes = useMemo(() => {
    let dishes = allDishes;
    if (activeCategory) dishes = dishes.filter(d => d.category === activeCategory);
    if (showVegOnly) dishes = dishes.filter(d => d.is_veg);
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      dishes = dishes.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    return dishes;
  }, [allDishes, activeCategory, showVegOnly, menuSearch]);

  const handleAddToCart = (dish: Dish) => {
    if (!restaurant) return;
    addItem(dish, restaurant.id, restaurant.name);
    showToast(`Added ${dish.name} to cart! 🛒`);
  };

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4">
        <span className="material-symbols-outlined text-[48px] text-[#363433]">store_mall_directory</span>
        <p className="text-sm text-[#a88a81]">Restaurant not found</p>
        <Link to="/" className="px-4 py-2 rounded-full bg-[#f36334] text-white text-xs font-bold">
          Go Home
        </Link>
      </div>
    );
  }

  const bestsellers = allDishes.filter(d => d.is_bestseller);

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <div className="relative w-full h-52 sm:h-64 bg-[#0f0e0d] overflow-hidden">
        <img src={restaurant.cover_image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-[#141312]/40 to-transparent" />
        <Link
          to="/"
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <img src={restaurant.logo} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-[#141312] shadow-lg" />
            <div>
              <h1 className="font-bold text-white text-xl leading-tight">{restaurant.name}</h1>
              <p className="text-xs text-white/80">{restaurant.cuisine.join(' • ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info Bar */}
      <div className="px-4 py-3 flex items-center gap-4 text-xs border-b border-white/5">
        <span className="flex items-center gap-1 text-[#ffba49] font-bold">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          {restaurant.rating} ({restaurant.rating_count > 999 ? `${(restaurant.rating_count / 1000).toFixed(1)}k` : restaurant.rating_count} ratings)
        </span>
        <span className="text-[#a88a81]">•</span>
        <span className="text-[#a88a81] flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {restaurant.delivery_time_min}-{restaurant.delivery_time_max} min
        </span>
        <span className="text-[#a88a81]">•</span>
        <span className="text-[#a88a81]">{restaurant.address}</span>
      </div>

      {/* Offers */}
      {restaurant.offers.length > 0 && (
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {restaurant.offers.map((offer, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1c1b1a] border border-[#f36334]/20 flex-shrink-0">
              <span className="material-symbols-outlined text-[#f36334] text-[16px]">local_offer</span>
              <span className="text-xs text-[#ffb59f] font-semibold whitespace-nowrap">{offer}</span>
            </div>
          ))}
          <Link
            to={`/booking/${restaurant.slug}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#f36334]/20 to-[#ffba49]/10 border border-[#ffba49]/20 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[#ffba49] text-[16px]">table_restaurant</span>
            <span className="text-xs text-[#ffba49] font-bold whitespace-nowrap">Book a Table</span>
          </Link>
        </div>
      )}

      {/* Menu Search & Veg Filter */}
      <div className="px-4 py-2 flex items-center gap-2">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a88a81] text-[18px]">search</span>
          <input
            type="text"
            value={menuSearch}
            onChange={e => setMenuSearch(e.target.value)}
            placeholder="Search in menu..."
            className="w-full bg-[#1c1b1a] text-white placeholder:text-[#a88a81] text-xs py-2.5 pl-9 pr-3 rounded-full border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#f36334]"
          />
        </div>
        <button
          onClick={() => setShowVegOnly(!showVegOnly)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-bold transition-all ${
            showVegOnly
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-[#1c1b1a] text-[#a88a81] border border-white/5'
          }`}
        >
          🟢 Veg
        </button>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            !activeCategory ? 'bg-[#f36334] text-white' : 'bg-[#211f1e] text-[#a88a81] border border-white/5'
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-[#f36334] text-white' : 'bg-[#211f1e] text-[#a88a81] border border-white/5'
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
            <span className="material-symbols-outlined text-[#ffba49] text-[18px]">auto_awesome</span>
            <h3 className="font-bold text-white text-sm">Bestsellers</h3>
          </div>
          <div className="flex flex-col gap-3">
            {bestsellers.map(dish => (
              <DishCard key={dish.id} dish={dish} onAdd={handleAddToCart} />
            ))}
          </div>
        </section>
      )}

      {/* Full Menu */}
      <section className="px-4 pt-4 flex flex-col gap-3">
        {activeCategory || menuSearch ? (
          <>
            <h3 className="font-bold text-white text-sm">
              {filteredDishes.length} {activeCategory || 'results'} {menuSearch ? `for "${menuSearch}"` : ''}
            </h3>
            {filteredDishes.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <span className="material-symbols-outlined text-[40px] text-[#363433]">search_off</span>
                <p className="text-sm text-[#a88a81]">No dishes found</p>
              </div>
            ) : (
              filteredDishes.map(dish => (
                <DishCard key={dish.id} dish={dish} onAdd={handleAddToCart} />
              ))
            )}
          </>
        ) : (
          <>
            {categories.map(cat => {
              const catDishes = allDishes.filter(d => d.category === cat && !d.is_bestseller);
              if (catDishes.length === 0) return null;
              return (
                <div key={cat}>
                  <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    {cat}
                    <span className="text-[11px] text-[#a88a81] font-normal">({catDishes.length})</span>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {catDishes.map(dish => (
                      <DishCard key={dish.id} dish={dish} onAdd={handleAddToCart} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}
