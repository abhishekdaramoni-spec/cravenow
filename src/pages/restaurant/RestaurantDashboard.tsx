import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { getDishesByRestaurant } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';
import { useToast } from '@/contexts/ToastContext';

export default function RestaurantDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'bookings'>('orders');

  // We manage Punjab Grill for this demo
  const restaurant = RESTAURANTS[0];
  const dishes = getDishesByRestaurant(restaurant.id);
  const [isOpen, setIsOpen] = useState(restaurant.is_open);

  const [activeOrders, setActiveOrders] = useState([
    { id: 'ORD-9901', customer: 'Rohan Verma', items: ['Butter Chicken x1', 'Garlic Naan x2'], total: 437, status: 'New', time: '2 min ago' },
    { id: 'ORD-9899', customer: 'Meera Iyer', items: ['Dal Makhani x1', 'Tandoori Roti x3', 'Lassi x1'], total: 465, status: 'Preparing', time: '11 min ago' },
    { id: 'ORD-9896', customer: 'Kabir Sen', items: ['Chicken Biryani x2'], total: 658, status: 'Ready for Pickup', time: '19 min ago' },
  ]);

  const updateOrderStatus = (orderId: string, nextStatus: string) => {
    setActiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    showToast(`Order ${orderId} updated to: ${nextStatus}`);
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] p-4 sm:p-6 max-w-5xl mx-auto pb-28">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={restaurant.logo} alt="" className="w-12 h-12 rounded-2xl object-cover border border-white/10" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#f36334]/20 text-[#ffb59f] text-[10px] font-bold uppercase tracking-wider">
                Kitchen Portal
              </span>
              <span className="text-xs text-[#a88a81]">{restaurant.address}</span>
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5">{restaurant.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              showToast(`Kitchen ${isOpen ? 'Paused (offline)' : 'Opened (accepting orders)'}`);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isOpen
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {isOpen ? 'Accepting Orders' : 'Store Paused'}
          </button>
          <Link
            to={`/restaurant/${restaurant.slug}`}
            className="px-3 py-1.5 rounded-full bg-[#211f1e] hover:bg-[#2b2a28] text-xs font-semibold text-white transition-colors"
          >
            View Live Menu
          </Link>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-3 gap-3 my-6">
        <div className="bg-[#1c1b1a] p-3.5 rounded-2xl border border-white/5">
          <span className="text-xs text-[#a88a81]">Today&apos;s Orders</span>
          <span className="text-xl font-bold text-white block mt-1">42</span>
        </div>
        <div className="bg-[#1c1b1a] p-3.5 rounded-2xl border border-white/5">
          <span className="text-xs text-[#a88a81]">Today&apos;s Revenue</span>
          <span className="text-xl font-bold text-white block mt-1">{formatPrice(18940)}</span>
        </div>
        <div className="bg-[#1c1b1a] p-3.5 rounded-2xl border border-white/5">
          <span className="text-xs text-[#a88a81]">Avg Prep Time</span>
          <span className="text-xl font-bold text-white block mt-1">19 min</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        {(['orders', 'menu', 'bookings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab ? 'bg-[#f36334] text-white' : 'bg-[#1c1b1a] text-[#a88a81] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-3">
          <h3 className="font-bold text-white text-sm">Kitchen Orders in Progress ({activeOrders.length})</h3>
          <div className="space-y-3">
            {activeOrders.map(order => (
              <div key={order.id} className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{order.id}</span>
                    <span className="text-xs text-[#a88a81]">• {order.customer}</span>
                    <span className="text-[10px] text-[#a88a81] bg-[#211f1e] px-2 py-0.5 rounded-full">{order.time}</span>
                  </div>
                  <p className="text-xs text-[#ffb59f]">{order.items.join(' • ')}</p>
                  <span className="text-xs font-bold text-white block">{formatPrice(order.total)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'New' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="px-3 py-1.5 rounded-xl bg-[#f36334] hover:bg-[#d44c20] text-xs font-bold text-white transition-colors"
                    >
                      Accept &amp; Cook
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-bold text-black transition-colors"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'Ready for Pickup' && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                      Waiting for Rider 🛵
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-sm">Dishes in Menu ({dishes.length})</h3>
            <button
              onClick={() => showToast('New dish modal opened')}
              className="px-3 py-1 rounded-xl bg-[#f36334] text-xs font-bold text-white"
            >
              + Add Dish
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dishes.map(dish => (
              <div key={dish.id} className="bg-[#1c1b1a] p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={dish.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white truncate block">{dish.name}</span>
                    <span className="text-[11px] text-[#f36334] font-bold">{formatPrice(dish.price)}</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Toggled in-stock for ${dish.name}`)}
                  className="px-2.5 py-1 rounded-lg bg-[#211f1e] text-[11px] text-[#a88a81] hover:text-white"
                >
                  In Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="mt-6 space-y-3">
          <h3 className="font-bold text-white text-sm">Dine-in Table Reservations</h3>
          <div className="space-y-3">
            {[
              { id: 'BK-101', name: 'Nikhil Roy', guests: 4, time: 'Today, 8:00 PM', table: 'Outdoor Balcony', status: 'Confirmed' },
              { id: 'BK-102', name: 'Divya Nambiar', guests: 2, time: 'Today, 8:30 PM', table: 'Indoor Booth', status: 'Confirmed' },
            ].map(b => (
              <div key={b.id} className="p-4 rounded-2xl bg-[#1c1b1a] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-white block">{b.name} ({b.guests} guests)</span>
                  <span className="text-[11px] text-[#a88a81]">{b.time} • {b.table}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
