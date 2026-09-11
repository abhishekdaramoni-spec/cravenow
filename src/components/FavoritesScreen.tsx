import React from 'react';
import { Dish, ScreenType } from '../types';
import { DISHES } from '../data/mockData';

interface FavoritesScreenProps {
  onOpenCustomizer: (dish: Dish) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onOpenCustomizer,
  onNavigate,
}) => {
  const favoriteDishes = DISHES.slice(0, 3);

  return (
    <div className="flex flex-col w-full pb-28 text-[#e6e1df] px-3 sm:px-4 pt-2 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-white">Your Saved Favorites</h2>
          <p className="text-xs text-[#a88a81]">Quick re-orders from your go-to artisan kitchens</p>
        </div>
        <span className="w-8 h-8 rounded-full bg-[#f36334]/20 text-[#f36334] flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">favorite</span>
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {favoriteDishes.map((dish) => (
          <div
            key={dish.id}
            onClick={() => onOpenCustomizer(dish)}
            className="flex flex-col bg-[#1c1b1a] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group hover:border-white/15 transition-all"
          >
            <div className="relative h-36 bg-[#211f1e]">
              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-[#f36334] flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
              <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-bold text-[#ffba49]">
                ★ {dish.rating} ({dish.reviewsCount})
              </div>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">{dish.name}</span>
                <span className="text-xs font-mono text-[#f36334] font-bold">
                  ${dish.price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCustomizer(dish);
                }}
                className="px-3 py-1.5 rounded-full bg-[#f36334] text-white text-xs font-bold hover:bg-[#d44c20] transition-colors"
              >
                Order Again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
