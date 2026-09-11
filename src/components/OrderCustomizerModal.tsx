import React, { useState } from 'react';
import { Dish, SizeOption, ToppingOption, CartItem } from '../types';
import { SIZE_OPTIONS, TOPPING_OPTIONS } from '../data/mockData';

interface OrderCustomizerModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const OrderCustomizerModal: React.FC<OrderCustomizerModalProps> = ({
  dish,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !dish) return null;

  const [selectedSize, setSelectedSize] = useState<SizeOption>(SIZE_OPTIONS[1]); // Double as default
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([TOPPING_OPTIONS[0]]); // Applewood bacon checked by default
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
    const cartItem: CartItem = {
      id: 'cart-' + Date.now(),
      dishId: dish.id,
      name: `${dish.name} (${selectedSize.name})`,
      image: dish.image,
      size: selectedSize,
      selectedToppings,
      instructions,
      unitPrice,
      quantity,
      totalPrice,
    };

    setTimeout(() => {
      onAddToCart(cartItem);
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1c1b1a] rounded-t-3xl max-h-[88vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col max-w-md mx-auto w-full border-t border-white/10 animate-toast-in">
        {/* Sheet Drag Handle & Close */}
        <div className="sticky top-0 bg-[#1c1b1a]/95 backdrop-blur-md z-10 px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#2b2a28]/60">
          <div className="w-10 h-1.5 rounded-full bg-[#363433] mx-auto absolute left-1/2 -translate-x-1/2 top-2"></div>
          <span className="font-headline-sm font-bold text-white mt-2">Customize Order</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#211f1e] text-neutral-300 flex items-center justify-center hover:bg-[#2b2a28] hover:text-white transition-colors mt-2"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Dish Info Header */}
        <div className="px-4 py-3 flex items-center gap-3">
          <img
            alt={dish.name}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-white/10 shadow-md"
            src={dish.image}
          />
          <div className="flex flex-col min-w-0">
            <h4 className="font-headline-sm font-bold text-white truncate">{dish.name}</h4>
            <span className="text-sm font-semibold text-[#f36334]">
              Base price: ${dish.price.toFixed(2)}
            </span>
            <span className="text-xs text-[#a88a81]">
              Select size and gourmet toppings
            </span>
          </div>
        </div>

        {/* Section: Choose Size */}
        <div className="px-4 pt-2 pb-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white tracking-wide">Choose Size</span>
            <span className="text-[11px] font-bold text-[#ffba49] bg-[#c18511]/25 px-2.5 py-0.5 rounded-full border border-[#ffba49]/30">
              Required (1)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SIZE_OPTIONS.map((size) => {
              const isSelected = selectedSize.id === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/30 ring-1 ring-white/20'
                      : 'bg-[#211f1e] hover:bg-[#2b2a28] text-neutral-200 border border-white/5'
                  }`}
                >
                  <span className="text-xs font-bold">{size.name}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#a88a81]'}`}>
                    {size.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Extra Gourmet Toppings */}
        <div className="px-4 py-2 flex flex-col gap-2.5">
          <span className="text-sm font-bold text-white tracking-wide">
            Add Extra Gourmet Toppings
          </span>
          <div className="flex flex-col gap-2">
            {TOPPING_OPTIONS.map((topping) => {
              const isChecked = selectedToppings.some((t) => t.id === topping.id);
              return (
                <label
                  key={topping.id}
                  onClick={() => toggleTopping(topping)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#211f1e] hover:bg-[#2b2a28] cursor-pointer transition-colors border border-white/5 select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="w-5 h-5 rounded accent-[#f36334] bg-[#363433] cursor-pointer"
                    />
                    <span className="text-xs font-medium text-white">{topping.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#f36334]">
                    +${topping.price.toFixed(2)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section: Special Instructions */}
        <div className="px-4 py-2 flex flex-col gap-1.5">
          <span className="text-sm font-bold text-white tracking-wide">
            Kitchen Instructions
          </span>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-[#211f1e] text-white placeholder:text-[#a88a81] p-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#f36334] border border-white/5 resize-none"
            placeholder="e.g. sauce on the side, extra crispy fries, no pickles..."
            rows={2}
          ></textarea>
        </div>

        {/* Bottom Sticky Action: Quantity & Add Button */}
        <div className="sticky bottom-0 bg-[#0f0e0d]/95 backdrop-blur-lg px-4 py-4 mt-3 flex items-center gap-3 border-t border-white/10">
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

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`flex-1 py-3.5 px-4 rounded-full font-bold text-xs flex items-center justify-between shadow-lg active:scale-95 transition-all min-h-[50px] ${
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
                <span>Add to Bag</span>
                <span className="text-sm font-extrabold font-mono">${totalPrice.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
