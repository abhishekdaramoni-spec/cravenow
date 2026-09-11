import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '@/lib/constants';
import { StorageService } from '@/services/storageService';
import { useToast } from '@/contexts/ToastContext';
import type { Order } from '@/types';

const ORDER_STAGES: { key: Order['status']; label: string; icon: string; desc: string }[] = [
  { key: 'pending', label: 'Order Placed', icon: 'receipt', desc: 'Sent to kitchen for acceptance' },
  { key: 'confirmed', label: 'Accepted', icon: 'check_circle', desc: 'Kitchen acknowledged the order' },
  { key: 'preparing', label: 'Cooking & Preparing', icon: 'skillet', desc: 'Chef is preparing your meal fresh' },
  { key: 'ready', label: 'Packed & Ready', icon: 'inventory_2', desc: 'Sealed with tamper-proof packaging' },
  { key: 'on_the_way', label: 'Out for Delivery', icon: 'moped', desc: 'Rider is on the way to your door' },
  { key: 'delivered', label: 'Order Delivered', icon: 'home', desc: 'Delivered safely to your doorstep' },
];

export default function TrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { showToast } = useToast();
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  // Load actual order from StorageService
  const [order, setOrder] = useState<Order | null>(() => {
    if (!orderId) return null;
    return StorageService.getOrderById(orderId);
  });

  // Re-fetch on ID change
  useEffect(() => {
    if (orderId) {
      const found = StorageService.getOrderById(orderId);
      setOrder(found);
    }
  }, [orderId]);

  // Fallback demo order if directly navigating without placing an order
  const displayOrder: Order = order || {
    id: orderId || 'CN-DEMO',
    user_id: 'usr-priya',
    restaurant_id: 'rest-1',
    restaurant_name: 'Punjab Grill',
    restaurant_image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    delivery_partner_id: 'usr-rahul',
    address_id: 'addr-p1',
    delivery_address: 'Flat 302, Prestige Lakeside, Koramangala, Bangalore - 560034',
    status: 'on_the_way',
    subtotal: 548,
    delivery_fee: 30,
    platform_fee: 15,
    tax: 27.4,
    discount: 50,
    total: 570.4,
    payment_status: 'successful',
    payment_id: 'pay_demo_1234',
    payment_method: 'UPI',
    estimated_delivery_time: '20-25 mins',
    special_instructions: 'Please do not ring bell',
    items: [
      { id: '1', order_id: 'CN-DEMO', dish_id: 'd-1', name: 'Butter Chicken (Double)', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop', quantity: 1, unit_price: 299, total_price: 299, is_veg: false },
      { id: '2', order_id: 'CN-DEMO', dish_id: 'd-2', name: 'Dal Makhani', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop', quantity: 1, unit_price: 249, total_price: 249, is_veg: true },
    ],
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  const currentStatusIndex = Math.max(
    0,
    ORDER_STAGES.findIndex(s => s.key === displayOrder.status)
  );

  const handleAdvanceStatus = () => {
    const nextIdx = (currentStatusIndex + 1) % ORDER_STAGES.length;
    const nextStatus = ORDER_STAGES[nextIdx].key;
    const updated = StorageService.updateOrderStatus(displayOrder.id, nextStatus);
    if (updated) {
      setOrder({ ...updated });
    } else {
      setOrder(prev => (prev ? { ...prev, status: nextStatus } : null));
    }
    showToast(`Order #${displayOrder.id} status updated to: ${ORDER_STAGES[nextIdx].label} 🚀`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-32 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-white/5 bg-[#141312]/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/orders" className="w-8 h-8 rounded-full bg-[#1c1b1a] flex items-center justify-center text-[#a88a81] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-base font-bold text-white">Live Tracking &bull; #{displayOrder.id}</h1>
            <p className="text-[11px] text-[#a88a81]">{displayOrder.restaurant_name}</p>
          </div>
        </div>

        {/* QA simulator button */}
        <button
          onClick={handleAdvanceStatus}
          className="px-3 py-1.5 rounded-xl bg-[#f36334]/20 border border-[#f36334]/40 hover:bg-[#f36334]/30 text-xs text-[#ffb59f] font-bold transition-all flex items-center gap-1 active:scale-95"
          title="Simulate advancing to next order status"
        >
          <span className="material-symbols-outlined text-[15px]">fast_forward</span>
          <span>Advance</span>
        </button>
      </div>

      {/* SVG Map Section */}
      <div className="relative h-56 sm:h-72 w-full bg-[#1c1b1a] overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Pulsing delivery route */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
          <path
            d="M 50 140 Q 150 40 350 70"
            fill="none"
            stroke="#f36334"
            strokeWidth="4"
            strokeDasharray="8 8"
            className="animate-pulse"
          />
        </svg>

        {/* Kitchen Pin */}
        <div className="absolute bottom-10 left-8 z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#141312] border-2 border-[#f36334] flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">storefront</span>
          </div>
          <span className="text-[10px] font-bold bg-[#141312]/90 text-white px-2 py-0.5 rounded mt-1 border border-white/10 truncate max-w-[100px]">
            {displayOrder.restaurant_name}
          </span>
        </div>

        {/* Rider Pin */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
          <div className="w-11 h-11 rounded-full bg-[#f36334] border-2 border-white flex items-center justify-center shadow-xl shadow-[#f36334]/50 text-white">
            <span className="material-symbols-outlined text-[22px]">two_wheeler</span>
          </div>
          <span className="text-[10px] font-bold bg-[#f36334] text-white px-2 py-0.5 rounded-full mt-1 shadow-md">
            Rider on Way
          </span>
        </div>

        {/* Customer Pin */}
        <div className="absolute top-8 right-8 z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#141312] border-2 border-emerald-500 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">home</span>
          </div>
          <span className="text-[10px] font-bold bg-[#141312]/90 text-white px-2 py-0.5 rounded mt-1 border border-white/10">
            Delivery Spot
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Highlight Banner */}
        <div className="bg-[#1c1b1a] p-4 rounded-3xl border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f36334] animate-ping" />
              <span className="text-xs uppercase font-bold text-[#f36334] tracking-wider">
                {displayOrder.status.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {displayOrder.status === 'delivered' ? 'Order Delivered! 🎉' : `Estimated Arrival: ${displayOrder.estimated_delivery_time}`}
            </h2>
            <p className="text-xs text-[#a88a81]">To: {displayOrder.delivery_address}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-white font-mono">{formatPrice(displayOrder.total)}</span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Paid via {displayOrder.payment_method}</span>
          </div>
        </div>

        {/* 6-Stage Timeline Stepper */}
        <div className="bg-[#1c1b1a] p-4 rounded-3xl border border-white/5 space-y-3">
          <h3 className="font-bold text-sm text-white mb-2">Live Status Tracking</h3>
          <div className="space-y-3 relative pl-2">
            {ORDER_STAGES.map((stage, idx) => {
              const isPast = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              const isFuture = idx > currentStatusIndex;

              return (
                <div key={stage.key} className="flex items-start gap-3.5 relative">
                  {/* Vertical connecting line */}
                  {idx < ORDER_STAGES.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 w-0.5 h-7 ${
                        idx < currentStatusIndex ? 'bg-emerald-500' : 'bg-neutral-800'
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border transition-all ${
                      isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : isCurrent
                        ? 'bg-[#f36334] text-white border-[#ffb59f] shadow-md shadow-[#f36334]/30 scale-110'
                        : 'bg-[#141312] text-neutral-600 border-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{stage.icon}</span>
                  </div>

                  {/* Stage Text */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-white' : isPast ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-[#f36334]/20 text-[#ffb59f] px-2 py-0.5 rounded-full font-bold animate-pulse">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#a88a81] leading-tight mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner Card */}
        <div className="bg-[#1c1b1a] p-4 rounded-3xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-neutral-800 border border-white/10 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Rahul Kumar" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-white text-sm">Rahul Kumar</h4>
                <span className="text-[10px] bg-amber-400/20 text-amber-400 px-1.5 py-0.2 rounded font-bold">★ 4.9</span>
              </div>
              <p className="text-xs text-[#a88a81]">Honda Activa &bull; DL-1234</p>
              <span className="text-[10px] text-emerald-400 font-medium">Vaccinated &bull; Top Rated Partner</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Calling delivery partner Rahul Kumar (+91 98345 67890)...')}
              className="w-9 h-9 rounded-full bg-[#211f1e] text-[#f36334] hover:bg-[#2b2a28] flex items-center justify-center transition-colors"
              title="Call Delivery Partner"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </button>
            <button
              onClick={() => showToast('Chat: "I am downstairs at your building entrance!"')}
              className="w-9 h-9 rounded-full bg-[#211f1e] text-[#f36334] hover:bg-[#2b2a28] flex items-center justify-center transition-colors"
              title="Message Delivery Partner"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </button>
          </div>
        </div>

        {/* Order Details Accordion */}
        <div className="bg-[#1c1b1a] rounded-3xl border border-white/5 overflow-hidden">
          <button
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div>
              <h3 className="font-bold text-sm text-white">Itemized Order Summary</h3>
              <p className="text-xs text-[#a88a81]">{displayOrder.items.length} items &bull; Total {formatPrice(displayOrder.total)}</p>
            </div>
            <span className="material-symbols-outlined text-[#a88a81] transition-transform">
              {isSummaryExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isSummaryExpanded && (
            <div className="px-4 pb-4 border-t border-white/5 space-y-3 pt-3 text-xs">
              <div className="space-y-2">
                {displayOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#141312] text-[#f36334] font-bold font-mono flex items-center justify-center text-[11px]">
                        {item.quantity}x
                      </span>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <span className="font-mono text-white font-bold">{formatPrice(item.total_price)}</span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-3 border-t border-dashed border-white/10 space-y-1.5 text-[11px] text-[#a88a81]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatPrice(displayOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-white">
                    {displayOrder.delivery_fee === 0 ? <span className="text-emerald-400">FREE</span> : formatPrice(displayOrder.delivery_fee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-mono text-white">{formatPrice(displayOrder.platform_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="font-mono text-white">{formatPrice(displayOrder.tax)}</span>
                </div>
                {displayOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(displayOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-white/10 text-xs font-bold text-white">
                  <span>Total Paid</span>
                  <span className="text-[#f36334] font-mono text-sm">{formatPrice(displayOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back navigation */}
        <div className="flex justify-center pt-2">
          <Link to="/orders" className="text-xs text-[#a88a81] hover:text-white flex items-center gap-1">
            <span>View All My Orders</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
