import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice } from '@/lib/constants';

export default function CheckoutPage() {
  const { items, total, subtotal, deliveryFee, platformFee, tax, discount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [instructions, setInstructions] = useState('');

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/tracking/new-order-${Math.floor(Math.random() * 1000)}`);
    }, 1500);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-32">
      <div className="p-4 border-b border-[#1c1b1a] bg-[#141312] sticky top-0 z-10 flex items-center gap-4">
        <Link to="/cart" className="text-[#a88a81]">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-xl font-semibold">Checkout</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Delivery Address */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f36334]">location_on</span>
              Delivery Address
            </h3>
            <button className="text-[#f36334] text-sm font-medium">Change</button>
          </div>
          <p className="text-[#a88a81] text-sm leading-relaxed">
            Flat 302, Prestige Lakeside, Koramangala, Bangalore - 560034
          </p>
          <div className="mt-3 text-sm text-[#a88a81]">
            <span className="font-medium text-[#e6e1df]">{user?.name || 'Guest User'}</span>
            <span className="mx-2">•</span>
            <span>{user?.phone || '+91 9876543210'}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl">
          <h3 className="font-medium mb-3 border-b border-[#141312] pb-3">Order Summary</h3>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-[#f36334] font-medium">{item.quantity}x</span>
                  <span>{item.name}</span>
                </div>
                <span>{formatPrice((item.price || item.unitPrice || 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[#141312]">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any delivery instructions? (e.g., Leave at door)"
              className="w-full bg-[#141312] rounded-xl p-3 text-sm outline-none resize-none h-20"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl space-y-3">
          <h3 className="font-medium mb-2 border-b border-[#141312] pb-3">Payment Method</h3>
          
          <label className="flex items-center justify-between p-3 border border-[#141312] rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#f36334]">qr_code_scanner</span>
              <span>UPI (GPay, PhonePe)</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#f36334]' : 'border-[#a88a81]'}`}>
              {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[#f36334]" />}
            </div>
            <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
          </label>
          
          <label className="flex items-center justify-between p-3 border border-[#141312] rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#f36334]">credit_card</span>
              <span>Credit / Debit Card</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#f36334]' : 'border-[#a88a81]'}`}>
              {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#f36334]" />}
            </div>
            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
          </label>

          <label className="flex items-center justify-between p-3 border border-[#141312] rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#f36334]">payments</span>
              <span>Cash on Delivery</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#f36334]' : 'border-[#a88a81]'}`}>
              {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#f36334]" />}
            </div>
            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
          </label>
        </div>

        {/* Bill Summary */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl space-y-2 text-sm text-[#a88a81]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>{formatPrice(platformFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>{formatPrice(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Place Order Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1c1b1a] border-t border-[#141312] p-4 flex gap-4 items-center">
        <div className="flex-1">
          <p className="text-xs text-[#a88a81]">Total to pay</p>
          <p className="text-xl font-bold">{formatPrice(total)}</p>
        </div>
        <button 
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="bg-[#f36334] text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              Processing...
            </>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );
}
