import React, { useState } from 'react';
import { Dish, ScreenType } from '../types';
import { DISHES, CATEGORIES } from '../data/mockData';

interface SearchScreenProps {
  onOpenCustomizer: (dish: Dish) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onOpenCustomizer,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', 'Burgers', 'Artisan Pizza', 'Ramen', 'Free Delivery', 'Under $15'];

  const results = DISHES.filter((d) => {
    const matchesSearch =
      !searchTerm ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedTag === 'Burgers') return d.category === 'Burgers';
    if (selectedTag === 'Artisan Pizza') return d.category === 'Artisan Pizza';
    if (selectedTag === 'Ramen') return d.category === 'Ramen & Broth';
    if (selectedTag === 'Free Delivery') return (d.deliveryFee || '').includes('Free');
    if (selectedTag === 'Under $15') return d.price < 15;
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-28 text-[#e6e1df] px-3 sm:px-4 pt-2 max-w-md mx-auto">
      {/* Search Bar */}
      <div className="relative flex items-center mb-3">
        <span className="material-symbols-outlined text-[#a88a81] absolute left-3 text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search artisan burgers, wood-fired pizza, ramen..."
          className="w-full bg-[#1c1b1a] text-white placeholder:text-[#a88a81] text-xs py-3 pl-10 pr-10 rounded-full border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#f36334]"
          autoFocus
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 text-[#a88a81] hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 mb-3">
        {tags.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#f36334] text-white'
                  : 'bg-[#211f1e] text-[#a88a81] hover:text-white border border-white/5'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Popular Search Suggestions */}
      {!searchTerm && (
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#a88a81] block mb-2">
            Trending Searches
          </span>
          <div className="flex flex-wrap gap-2">
            {['Truffle Smash Burger', 'Wood-Fired Margherita', 'Tonkotsu Ramen', 'Rosemary Fries'].map(
              (query) => (
                <button
                  key={query}
                  onClick={() => setSearchTerm(query)}
                  className="px-3 py-1 rounded-lg bg-[#1c1b1a] hover:bg-[#2b2a28] text-xs text-neutral-300 border border-white/5 flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#f36334]">
                    trending_up
                  </span>
                  {query}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {results.length} Artisan Dishes Found
        </span>
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-3">
        {results.map((dish) => (
          <div
            key={dish.id}
            onClick={() => onOpenCustomizer(dish)}
            className="flex items-center gap-3 p-3 bg-[#1c1b1a] hover:bg-[#211f1e] rounded-2xl border border-white/5 cursor-pointer transition-all active:scale-98"
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="w-20 h-20 rounded-xl object-cover border border-white/10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-sm text-white block truncate">{dish.name}</span>
              <p className="text-[11px] text-[#a88a81] line-clamp-1 mt-0.5">{dish.description}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-bold text-[#f36334] font-mono">
                  ${dish.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-neutral-400 bg-[#2b2a28] px-1.5 py-0.2 rounded">
                  {dish.prepTime}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomizer(dish);
              }}
              className="w-9 h-9 rounded-full bg-[#f36334] text-white flex items-center justify-center hover:bg-[#d44c20] transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
