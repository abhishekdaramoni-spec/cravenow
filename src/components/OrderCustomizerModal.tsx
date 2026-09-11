import React, { useState } from 'react';
import { Dish, SizeOption, ToppingOption } from '@/types';
import { formatPrice } from '@/lib/constants';

export const INDIAN_SIZE_OPTIONS: SizeOption[] = [
  { id: 'sz-reg', name: 'Regular', label: 'Standard portion for 1', extraPrice: 0 },
  { id: 'sz-large', name: 'Large', label: 'Hungry soul / Sharing for 2', extraPrice: 60 },
  { id: 'sz-jumbo', name: 'Jumbo Feast', label: 'Family feast portion', extraPrice: 120 },
];

export const INDIAN_ADDON_OPTIONS: ToppingOption[] = [
  { id: 'add-butter', name: 'Extra Amul Butter Cube', price: 25 },
  { id: 'add-cheese', name: 'Melted Mozzarella Cheese', price: 45 },
  { id: 'add-tadka', name: 'Desi Ghee Garlic Tadka', price: 30 },
  { id: 'add-chutney', name: 'Spicy Mint & Coriander Chutney', price: 20 },
  { id: 'add-raita', name: 'Chilled Boondi Raita', price: 40 },
];

interface OrderCustomizerModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    dish: Dish,
    quantity: number,
    instructions: string,
    customization: { size: SizeOption; toppings: ToppingOption[]; unitPrice: number }
  ) => void;
}

export const OrderCustomizerModal: React.FC<OrderCustomizerModalProps> = ({
  dish,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !dish) return null;

  const [selectedSize, setSelectedSize] = useState<SizeOption>(INDIAN_SIZE_OPTIONS[0]);
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [instructions, setInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const toggleTopping = (topping: ToppingOption) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const toppingsCost = selectedToppings.reduce((acc, t) => acc + t.price, 0);
  const unitPrice = dish.price + selectedSize.extraPrice + toppingsCost;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    setIsAdded(true);
    setTimeout(() => {
      onAddToCart(dish, quantity, instructions, {
        size: selectedSize,
        toppings: selectedToppings,
        unitPrice,
      });
      setIsAdded(false);
      onClose();
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center sm:items-center transition-opacity duration-300 p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1c1b1a] rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col max-w-md w-full border border-white/10 animate-toast-in">
        {/* Sheet Drag Handle & Close */}
        <div className="sticky top-0 bg-[#1c1b1a]/95 backdrop-blur-md z-10 px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#2b2a28]/60">
          <div className="w-10 h-1.5 rounded-full bg-[#363433] mx-auto absolute left-1/2 -translate-x-1/2 top-2 sm:hidden"></div>
          <span className="font-bold text-white text-base mt-2 sm:mt-0">Customize Dish</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#211f1e] text-neutral-300 flex items-center justify-center hover:bg-[#2b2a28] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Dish Info Header */}
        <div className="px-4 py-3.5 flex items-center gap-3 border-b border-white/5">
          <img
            alt={dish.name}
            className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-white/10 shadow-md"
            src={dish.image}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span>{dish.is_veg ?? dish.isVeg ? '🟢' : '🔴'}</span>
              <span className="text-[10px] text-[#a88a81] uppercase font-bold">{dish.category}</span>
            </div>
            <h4 className="font-bold text-white text-base truncate">{dish.name}</h4>
            <p className="text-xs text-[#a88a81] line-clamp-1 mt-0.5">{dish.description}</p>
            <span className="text-sm font-bold text-[#f36334] mt-1">
              Base: {formatPrice(dish.price)}
            </span>
          </div>
        </div>

        {/* Section: Choose Portion / Size */}
        <div className="px-4 pt-3 pb-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white tracking-wide">Choose Portion Size</span>
            <span className="text-[10px] font-bold text-[#ffba49] bg-[#c18511]/25 px-2 py-0.5 rounded-full border border-[#ffba49]/30">
              Select 1
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {INDIAN_SIZE_OPTIONS.map((size) => {
              const isSelected = selectedSize.id === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 px-2 rounded-2xl text-center flex flex-col items-center justify-center transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/30 ring-1 ring-white/20'
                      : 'bg-[#211f1e] hover:bg-[#2b2a28] text-neutral-200 border border-white/5'
                  }`}
                >
                  <span className="text-xs font-bold">{size.name}</span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#a88a81]'}`}>
                    {size.extraPrice === 0 ? 'Standard' : `+${formatPrice(size.extraPrice)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Extra Add-ons & Toppings */}
        <div className="px-4 py-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white tracking-wide">
              Add-ons &amp; Accompaniments
            </span>
            <span className="text-[10px] text-[#a88a81]">Optional</span>
          </div>
          <div className="flex flex-col gap-2">
            {INDIAN_ADDON_OPTIONS.map((addon) => {
              const isChecked = selectedToppings.some((t) => t.id === addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleTopping(addon)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border select-none ${
                    isChecked
                      ? 'bg-[#f36334]/15 border-[#f36334]/50 text-white'
                      : 'bg-[#211f1e] hover:bg-[#2b2a28] border-white/5 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#f36334]">
                      {isChecked ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span className="text-xs font-medium">{addon.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#f36334]">
                    +{formatPrice(addon.price)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Kitchen Instructions */}
        <div className="px-4 py-2 flex flex-col gap-1.5">
          <span className="text-sm font-bold text-white tracking-wide">
            Cooking Instructions
          </span>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-[#211f1e] text-white placeholder:text-[#a88a81] p-3 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-[#f36334] border border-white/5 resize-none"
            placeholder="e.g. make it extra spicy, less oil, cut into pieces, pack chutney separately..."
            rows={2}
          />
        </div>

        {/* Bottom Sticky Action: Stepper & Add Button */}
        <div className="sticky bottom-0 bg-[#141312]/95 backdrop-blur-lg px-4 py-3 mt-3 flex items-center gap-3 border-t border-white/10">
          {/* Stepper */}
          <div className="flex items-center bg-[#211f1e] rounded-full px-2 py-1 gap-3 border border-white/5">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-[#363433] transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="font-bold text-sm text-white min-w-[16px] text-center font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-[#363433] transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Add CTA */}
          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`flex-1 py-3.5 px-4 rounded-full font-bold text-xs flex items-center justify-between shadow-lg active:scale-95 transition-all min-h-[48px] ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#f36334] hover:bg-[#d44c20] text-white shadow-[#f36334]/30'
            }`}
          >
            {isAdded ? (
              <span className="mx-auto flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[18px]">check</span>
                Added to Feast! 🍔
              </span>
            ) : (
              <>
                <span>Add to Cart</span>
                <span className="text-sm font-extrabold font-mono">{formatPrice(totalPrice)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
