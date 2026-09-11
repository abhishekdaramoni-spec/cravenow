import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/constants';
import { useToast } from '@/contexts/ToastContext';
import { COUPONS } from '@/data/restaurants';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    platformFee,
    tax,
    discount,
    total,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    restaurantName,
  } = useCart();

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      showToast(res.message, 'success');
      setCouponInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleQuickCoupon = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    showToast('Promo code removed', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#141312] text-[#e6e1df] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#1c1b1a] border border-white/5 flex items-center justify-center text-3xl mb-4 text-[#a88a81]">
          🛍️
        </div>
        <h2 className="text-2xl font-bold text-white mb-1.5">Your Bag is Empty</h2>
        <p className="text-xs text-[#a88a81] max-w-xs mb-6 leading-relaxed">
          Good food is always just a few taps away. Explore kitchens near you and start curating your feast.
        </p>
        <Link 
          to="/"
          className="bg-[#f36334] hover:bg-[#d44c20] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-lg shadow-[#f36334]/25 active:scale-95 transition-all"
        >
          Explore Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-36 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-white/5 bg-[#141312]/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">{restaurantName || 'Your Feast'}</h1>
          <p className="text-xs text-[#a88a81]">{items.reduce((acc, i) => acc + i.quantity, 0)} items in your bag</p>
        </div>
        <button
          onClick={() => {
            clearCart();
            showToast('Cart cleared', 'info');
          }}
          className="text-xs text-[#a88a81] hover:text-red-400 font-semibold transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Free Delivery Banner Indicator */}
        <div className="bg-[#1c1b1a] border border-white/5 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">
              {subtotal >= 500 ? 'local_shipping' : 'moped'}
            </span>
            {subtotal >= 500 ? (
              <span className="text-emerald-400 font-bold">🎉 You unlocked FREE Delivery!</span>
            ) : (
              <span className="text-[#a88a81]">
                Add <span className="text-white font-bold">{formatPrice(500 - subtotal)}</span> more for FREE delivery
              </span>
            )}
          </div>
          <Link to="/" className="text-xs text-[#f36334] font-bold hover:underline">
            Add More
          </Link>
        </div>

        {/* Itemized Cart List */}
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 flex gap-3.5 relative">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs">{item.is_veg ?? item.isVeg ? '🟢' : '🔴'}</span>
                  <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                </div>

                {/* Customizations tags */}
                {item.size && (
                  <span className="inline-block text-[10px] bg-[#211f1e] text-[#ffb59f] px-2 py-0.5 rounded-md font-semibold mr-1.5 mb-1">
                    {item.size.name}
                  </span>
                )}
                {item.selectedToppings && item.selectedToppings.length > 0 && (
                  <p className="text-[11px] text-[#a88a81] truncate mb-1">
                    + {item.selectedToppings.map(t => t.name).join(', ')}
                  </p>
                )}

                {/* Special instructions */}
                {item.special_instructions && (
                  <p className="text-[10px] text-amber-400 italic mb-1 truncate">
                    Note: &ldquo;{item.special_instructions}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-[#f36334] font-mono">
                    {formatPrice((item.price || item.unitPrice || 0) * item.quantity)}
                  </span>
                  
                  {/* Stepper */}
                  <div className="flex items-center gap-2.5 bg-[#141312] border border-white/5 rounded-full px-2 py-0.5">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-[#a88a81] hover:text-white p-1 active:scale-90"
                      title="Decrease quantity"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="font-bold text-xs text-white min-w-[14px] text-center font-mono">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-[#f36334] hover:text-[#ffb59f] p-1 active:scale-90"
                      title="Increase quantity"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove button */}
              <button 
                onClick={() => {
                  removeItem(item.id);
                  showToast(`Removed ${item.name}`, 'info');
                }}
                className="absolute top-3 right-3 text-[#a88a81] hover:text-red-400 transition-colors"
                title="Remove dish"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))}
        </div>

        {/* Coupons & Offers Section */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f36334] text-[20px]">local_offer</span>
              Coupons &amp; Offers
            </h3>
            {appliedCoupon && (
              <span className="text-xs text-emerald-400 font-bold">Applied: {appliedCoupon}</span>
            )}
          </div>

          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input 
              type="text" 
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              disabled={!!appliedCoupon}
              placeholder="Enter coupon code (e.g. CRAVE30)" 
              className="flex-1 bg-[#141312] border border-white/5 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#f36334] uppercase disabled:opacity-50"
            />
            {appliedCoupon ? (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 rounded-xl text-xs font-bold hover:bg-red-500/30"
              >
                Remove
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#f36334] hover:bg-[#d44c20] text-white px-5 rounded-xl text-xs font-bold transition-colors"
              >
                Apply
              </button>
            )}
          </form>

          {/* Quick coupon chips */}
          {!appliedCoupon && (
            <div className="flex flex-wrap gap-2 pt-1">
              {COUPONS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleQuickCoupon(c.code)}
                  className="px-2.5 py-1 rounded-lg bg-[#211f1e] hover:bg-[#2b2a28] border border-white/5 text-[11px] text-[#ffb59f] font-mono font-bold flex items-center gap-1"
                >
                  <span>🏷️</span>
                  <span>{c.code}</span>
                  <span className="text-[10px] text-[#a88a81]">
                    ({c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Itemized Bill Breakdown */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 space-y-2.5 text-xs">
          <h3 className="font-bold text-sm text-white mb-2 pb-2 border-b border-white/5">Bill Summary</h3>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Item Total (Subtotal)</span>
            <span className="font-mono text-white">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Delivery Partner Fee</span>
            <span className="font-mono text-white">
              {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(deliveryFee)}
            </span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Platform Fee</span>
            <span className="font-mono text-white">{formatPrice(platformFee)}</span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Restaurant GST &amp; Taxes (5%)</span>
            <span className="font-mono text-white">{formatPrice(tax)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Promo Discount ({appliedCoupon})</span>
              <span className="font-mono">-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-base border-t border-white/5 pt-3 mt-3">
            <span className="text-white">To Pay</span>
            <span className="text-[#f36334] font-mono text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Continue Shopping Action */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="text-xs text-[#a88a81] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Continue Shopping (Add more dishes)</span>
          </Link>
        </div>
      </div>

      {/* Sticky Bottom Checkout Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-[#141312]/95 backdrop-blur-xl border-t border-white/10 p-4 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#a88a81] uppercase font-bold tracking-wider">Total Payable</span>
            <span className="text-xl font-black text-white font-mono">{formatPrice(total)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 max-w-sm bg-[#f36334] hover:bg-[#d44c20] text-white py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#f36334]/30 active:scale-[0.98] transition-all"
          >
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
