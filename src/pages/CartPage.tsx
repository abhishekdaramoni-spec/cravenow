import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/constants';
import { useToast } from '@/contexts/ToastContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryFee, platformFee, tax, discount, total, clearCart } = useCart();
  const { showToast } = useToast();
  
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    setIsCouponApplied(true);
    showToast('Coupon applied successfully!', 'success');
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setIsCouponApplied(false);
    showToast('Coupon removed', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#141312] text-[#e6e1df] flex flex-col items-center justify-center p-4">
        <span className="material-symbols-outlined text-6xl text-[#a88a81] mb-4">shopping_cart</span>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-[#a88a81] text-center mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/"
          className="bg-[#f36334] text-white px-8 py-3 rounded-full font-medium"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  // Assuming all items are from the same restaurant for simplicity
  const restaurantName = items[0]?.restaurantName || 'Your Order';

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-32">
      <div className="p-4 border-b border-[#1c1b1a] bg-[#141312] sticky top-0 z-10">
        <h1 className="text-xl font-semibold">{restaurantName}</h1>
        <p className="text-sm text-[#a88a81]">{items.length} items</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-[#1c1b1a] p-4 rounded-2xl flex gap-4 relative">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className={`text-[12px] ${item.isVeg ? 'text-green-500' : 'text-red-500'}`}>
                    {item.isVeg ? '🟢' : '🔴'}
                  </span>
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                </div>
                <p className="text-[#a88a81] text-sm mb-2">{formatPrice(item.price || item.unitPrice || 0)}</p>
                
                <div className="flex items-center gap-3 bg-[#141312] w-fit rounded-lg px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-[#a88a81] p-1"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="font-medium w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-[#f36334] p-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 text-[#a88a81] hover:text-red-500"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f36334]">local_offer</span>
            Apply Coupon
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={isCouponApplied}
              placeholder="Enter coupon code" 
              className="flex-1 bg-[#141312] rounded-xl px-4 py-2 outline-none uppercase disabled:opacity-50"
            />
            {isCouponApplied ? (
              <button onClick={handleRemoveCoupon} className="text-red-500 px-4 font-medium">Remove</button>
            ) : (
              <button onClick={handleApplyCoupon} className="text-[#f36334] px-4 font-medium">Apply</button>
            )}
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl space-y-3">
          <h3 className="font-medium mb-2 border-b border-[#141312] pb-2">Bill Details</h3>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Item Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Delivery Fee</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Platform Fee</span>
            <span>{formatPrice(platformFee)}</span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Taxes</span>
            <span>{formatPrice(tax)}</span>
          </div>

          {isCouponApplied && (
            <div className="flex justify-between text-green-500 font-medium">
              <span>Item Discount</span>
              <span>-{formatPrice(50)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-semibold text-lg border-t border-[#141312] pt-3 mt-3">
            <span>To Pay</span>
            <span>{formatPrice(isCouponApplied ? total - 50 : total)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1c1b1a] border-t border-[#141312] p-4">
        <Link 
          to="/checkout"
          className="bg-[#f36334] text-white w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          Proceed to Checkout
          <span className="material-symbols-outlined">arrow_right_alt</span>
        </Link>
      </div>
    </div>
  );
}
