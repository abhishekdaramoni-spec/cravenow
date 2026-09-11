import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice } from '@/lib/constants';
import { StorageService } from '@/services/storageService';
import type { Order, Address } from '@/types';

export default function CheckoutPage() {
  const { items, total, subtotal, deliveryFee, platformFee, tax, discount, appliedCoupon, restaurantId, restaurantName, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const userId = user?.id || 'guest';
  const userAddresses = StorageService.getUserAddresses(userId);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    userAddresses.find(a => a.is_default)?.id || userAddresses[0]?.id || 'addr-default'
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#141312] text-[#e6e1df] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-[#a88a81] mb-6">Please add items to your bag before proceeding to checkout.</p>
        <Link to="/" className="bg-[#f36334] text-white px-6 py-2.5 rounded-full text-xs font-bold">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const selectedAddress = userAddresses.find(a => a.id === selectedAddressId) || userAddresses[0];

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;
    const created: Address = {
      id: `addr-${Date.now()}`,
      user_id: userId,
      label: newLabel,
      full_address: newAddressText.trim(),
      lat: 12.9352,
      lng: 77.6245,
      is_default: false,
      created_at: new Date().toISOString(),
    };
    StorageService.saveAddress(userId, created);
    setSelectedAddressId(created.id);
    setIsAddingAddress(false);
    setNewAddressText('');
    showToast('New delivery address saved!', 'success');
  };

  const handlePlaceOrder = () => {
    if (isProcessing) return; // Prevent duplicate submission

    if (!selectedAddress) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      showToast('Please enter a valid UPI ID (e.g. yourname@upi)', 'error');
      return;
    }

    setIsProcessing(true);

    const orderId = `CN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      user_id: userId,
      restaurant_id: restaurantId || 'rest-1',
      restaurant_name: restaurantName || 'Punjab Grill',
      restaurant_image: items[0]?.image || 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
      delivery_partner_id: 'usr-rahul',
      address_id: selectedAddress.id,
      delivery_address: selectedAddress.full_address,
      status: 'confirmed',
      subtotal,
      delivery_fee: deliveryFee,
      platform_fee: platformFee,
      tax,
      discount,
      total,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'successful',
      payment_id: paymentMethod === 'cod' ? null : `pay_cn_${Date.now()}`,
      payment_method: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Card (Ending in 4128)' : 'Cash on Delivery',
      estimated_delivery_time: '25-35 mins',
      special_instructions: instructions,
      items: items.map(i => ({
        id: `ord-item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        order_id: orderId,
        dish_id: i.dish_id || i.dishId || 'd-1',
        name: i.name,
        image: i.image,
        quantity: i.quantity,
        unit_price: i.price || i.unitPrice || 0,
        total_price: (i.price || i.unitPrice || 0) * i.quantity,
        is_veg: i.is_veg ?? i.isVeg ?? true,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save order in isolated user storage
    StorageService.saveOrder(newOrder);

    // Simulated payment processing delay
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      showToast(`Order #${orderId} confirmed successfully! 🎉`, 'success');
      navigate(`/tracking/${orderId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-36 max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-[#141312]/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/cart" className="w-8 h-8 rounded-full bg-[#1c1b1a] flex items-center justify-center text-[#a88a81] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </Link>
          <h1 className="text-lg font-bold text-white">Order Checkout</h1>
        </div>
        <span className="text-xs text-[#a88a81] font-mono">{items.length} items</span>
      </div>

      <div className="p-4 space-y-5">
        {/* Step 1: Delivery Address */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f36334] text-[20px]">location_on</span>
              1. Delivery Address
            </h3>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="text-xs text-[#f36334] font-bold hover:underline"
            >
              {isAddingAddress ? 'Cancel' : '+ Add Address'}
            </button>
          </div>

          {/* New address form */}
          {isAddingAddress && (
            <form onSubmit={handleSaveNewAddress} className="p-3 bg-[#141312] rounded-xl border border-white/5 space-y-3">
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewLabel(lbl)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${newLabel === lbl ? 'bg-[#f36334] text-white' : 'bg-[#1c1b1a] text-[#a88a81]'}`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <textarea
                value={newAddressText}
                onChange={e => setNewAddressText(e.target.value)}
                placeholder="Complete address (Flat no, building, street, landmark, pincode)"
                rows={2}
                className="w-full bg-[#1c1b1a] text-white text-xs p-2.5 rounded-xl border border-white/5 outline-none focus:border-[#f36334] resize-none"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#f36334] text-white text-xs font-bold rounded-xl"
              >
                Save &amp; Select Address
              </button>
            </form>
          )}

          {/* Address Cards */}
          <div className="space-y-2">
            {userAddresses.map(addr => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`p-3 rounded-xl border cursor-pointer flex items-start justify-between transition-all ${
                  selectedAddressId === addr.id
                    ? 'bg-[#f36334]/10 border-[#f36334]'
                    : 'bg-[#141312] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{addr.label}</span>
                    {addr.is_default && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#a88a81] leading-relaxed">{addr.full_address}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 flex-shrink-0 ${
                  selectedAddressId === addr.id ? 'border-[#f36334] bg-[#f36334]' : 'border-[#363433]'
                }`}>
                  {selectedAddressId === addr.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-[#a88a81] pt-1 flex items-center gap-2">
            <span className="font-semibold text-white">{user?.name || 'Customer'}</span>
            <span>&bull;</span>
            <span>{user?.phone || '+91 98765 43210'}</span>
          </div>
        </div>

        {/* Step 2: Order Items Summary */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f36334] text-[20px]">restaurant_menu</span>
              2. Items from {restaurantName || 'Kitchen'}
            </h3>
            <Link to="/cart" className="text-xs text-[#f36334] font-bold hover:underline">
              Edit
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {items.map(item => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-[#141312] flex items-center justify-center font-bold text-xs text-[#f36334] font-mono">
                    {item.quantity}x
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium text-white truncate block">{item.name}</span>
                    {item.size && (
                      <span className="text-[10px] text-[#a88a81]">{item.size.name}</span>
                    )}
                  </div>
                </div>
                <span className="font-mono text-white font-semibold">
                  {formatPrice((item.price || item.unitPrice || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery notes */}
          <div className="pt-2 border-t border-white/5">
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Delivery instructions (e.g., Leave with security / Ring bell once)"
              className="w-full bg-[#141312] border border-white/5 text-white text-xs p-3 rounded-xl outline-none focus:border-[#f36334] resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Step 3: Payment Method */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">payments</span>
            3. Payment Method
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'upi', label: 'UPI (GPay/PhonePe)', icon: 'smartphone' },
              { id: 'card', label: 'Credit / Debit Card', icon: 'credit_card' },
              { id: 'cod', label: 'Cash on Delivery', icon: 'payments' },
            ].map(pm => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id as any)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  paymentMethod === pm.id
                    ? 'bg-[#f36334]/15 border-[#f36334] text-white shadow-sm'
                    : 'bg-[#141312] border-white/5 text-[#a88a81] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#f36334]">{pm.icon}</span>
                <span className="text-xs font-bold leading-tight">{pm.label}</span>
              </button>
            ))}
          </div>

          {/* UPI details */}
          {paymentMethod === 'upi' && (
            <div className="p-3 bg-[#141312] rounded-xl border border-white/5 space-y-2">
              <label className="text-[11px] text-[#a88a81] block">Enter UPI ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  className="flex-1 bg-[#1c1b1a] border border-white/5 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-[#f36334]"
                />
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-2 rounded-lg flex items-center">
                  Verified ✓
                </span>
              </div>
            </div>
          )}

          {/* Card details (safe simulated input) */}
          {paymentMethod === 'card' && (
            <div className="p-3 bg-[#141312] rounded-xl border border-white/5 space-y-2">
              <span className="text-[11px] text-[#a88a81] block">Encrypted &amp; Secure Payment (Demo Simulator)</span>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                placeholder="Card Number: 4532 •••• •••• 4128"
                className="w-full bg-[#1c1b1a] border border-white/5 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-[#f36334]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(e.target.value)}
                  placeholder="MM / YY"
                  className="bg-[#1c1b1a] border border-white/5 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-[#f36334]"
                />
                <input
                  type="password"
                  maxLength={3}
                  placeholder="CVV: •••"
                  className="bg-[#1c1b1a] border border-white/5 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-[#f36334]"
                />
              </div>
            </div>
          )}

          {/* COD Notice */}
          {paymentMethod === 'cod' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-[#ffba49]">
              💵 Pay with cash or UPI on delivery to the rider. Please keep exact change ready.
            </div>
          )}
        </div>

        {/* Step 4: Final Bill Summary */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 space-y-2.5 text-xs">
          <h3 className="font-bold text-sm text-white mb-2 pb-2 border-b border-white/5">Order Totals</h3>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Item Subtotal</span>
            <span className="font-mono text-white">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Delivery Fee</span>
            <span className="font-mono text-white">
              {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(deliveryFee)}
            </span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Platform Fee</span>
            <span className="font-mono text-white">{formatPrice(platformFee)}</span>
          </div>
          
          <div className="flex justify-between text-[#a88a81]">
            <span>Restaurant Taxes (5% GST)</span>
            <span className="font-mono text-white">{formatPrice(tax)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Coupon Discount ({appliedCoupon})</span>
              <span className="font-mono">-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-base border-t border-white/5 pt-3 mt-3">
            <span className="text-white">Amount to Pay</span>
            <span className="text-[#f36334] font-mono text-xl">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Place Order CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-[#141312]/95 backdrop-blur-xl border-t border-white/10 p-4 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#a88a81] uppercase font-bold tracking-wider">Final Amount</span>
            <span className="text-xl font-black text-white font-mono">{formatPrice(total)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className={`flex-1 max-w-sm py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all ${
              isProcessing
                ? 'bg-neutral-800 text-[#a88a81] cursor-wait'
                : 'bg-[#f36334] hover:bg-[#d44c20] text-white shadow-[#f36334]/30'
            }`}
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Securing Order...</span>
              </>
            ) : (
              <>
                <span>Place Order &bull; {formatPrice(total)}</span>
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
