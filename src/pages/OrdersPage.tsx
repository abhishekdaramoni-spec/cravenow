import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/constants';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { StorageService } from '@/services/storageService';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const userId = user?.id || 'guest';
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  // Load actual user orders
  const orders: Order[] = StorageService.getUserOrders(userId);

  const activeOrders = orders.filter(o =>
    ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way', 'nearby'].includes(o.status)
  );
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', label: 'Delivered' };
      case 'cancelled':
        return { bg: 'bg-red-500/20 text-red-400 border-red-500/40', label: 'Cancelled' };
      case 'on_the_way':
      case 'picked_up':
        return { bg: 'bg-[#f36334]/20 text-[#ffb59f] border-[#f36334]/40', label: 'On The Way 🛵' };
      case 'preparing':
        return { bg: 'bg-amber-400/20 text-amber-400 border-amber-400/40', label: 'Preparing 🍳' };
      default:
        return { bg: 'bg-blue-400/20 text-blue-400 border-blue-400/40', label: 'Confirmed ✓' };
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addItem(
        {
          id: item.dish_id,
          name: item.name,
          description: '',
          price: item.unit_price,
          image: item.image,
          category: 'Reorder',
          restaurant_id: order.restaurant_id,
          restaurantName: order.restaurant_name,
          rating: 4.5,
        },
        order.restaurant_id,
        order.restaurant_name,
        item.quantity
      );
    });
    showToast(`Items from ${order.restaurant_name} loaded into bag! 🛒`, 'success');
    navigate('/cart');
  };

  const displayedList = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-32 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-white/5 bg-[#141312]/95 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-xl font-bold text-white">Your Orders</h1>
        <p className="text-xs text-[#a88a81] mt-0.5">
          {orders.length} total orders recorded for {user?.name || 'Guest'}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 bg-[#1c1b1a] p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/20'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            <span>Live Orders</span>
            {activeOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#f36334] text-[10px] font-black flex items-center justify-center">
                {activeOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'past'
                ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/20'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            <span>Past History</span>
            <span className="text-[11px] opacity-75">({pastOrders.length})</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {displayedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3 block">📦</span>
            <h3 className="text-base font-bold text-white mb-1">
              {activeTab === 'active' ? 'No Live Orders Right Now' : 'No Past Order History'}
            </h3>
            <p className="text-xs text-[#a88a81] max-w-xs mb-5">
              {activeTab === 'active'
                ? 'When you place an order, live tracking and kitchen updates will appear here.'
                : 'You have not completed any orders yet. Treat yourself to something delicious!'}
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full bg-[#f36334] hover:bg-[#d44c20] text-white text-xs font-bold transition-all shadow-md shadow-[#f36334]/25"
            >
              Order Food Now
            </Link>
          </div>
        ) : (
          displayedList.map(order => {
            const badge = getStatusBadge(order.status);
            const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-[#1c1b1a] rounded-3xl border border-white/5 p-4 space-y-3 hover:border-white/10 transition-all shadow-md"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.restaurant_image}
                      alt={order.restaurant_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm leading-tight">{order.restaurant_name}</h3>
                      <span className="text-[11px] text-[#a88a81] block mt-0.5">#{order.id} &bull; {dateStr}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Items summary */}
                <div className="py-2 border-y border-white/5 text-xs text-neutral-300">
                  <p className="line-clamp-2">
                    {order.items.map(i => `${i.name} (${i.quantity}x)`).join(' • ')}
                  </p>
                </div>

                {/* Total & Action Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-[#a88a81] uppercase font-bold block">Total Amount</span>
                    <span className="font-mono text-sm font-black text-white">{formatPrice(order.total)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTab === 'active' ? (
                      <Link
                        to={`/tracking/${order.id}`}
                        className="px-4 py-2 rounded-xl bg-[#f36334] hover:bg-[#d44c20] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#f36334]/25 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">location_searching</span>
                        <span>Track Live</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to={`/tracking/${order.id}`}
                          className="px-3 py-1.5 rounded-xl bg-[#211f1e] hover:bg-[#2b2a28] text-xs font-semibold text-neutral-300 transition-colors"
                        >
                          View Receipt
                        </Link>
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-3 py-1.5 rounded-xl bg-[#f36334]/20 hover:bg-[#f36334]/30 text-[#ffb59f] text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">refresh</span>
                          <span>Reorder</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
