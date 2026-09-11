import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { DISHES } from '@/data/dishes';
import { formatPrice } from '@/lib/constants';
import { useToast } from '@/contexts/ToastContext';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'orders' | 'users'>('overview');

  // Stats
  const totalRevenue = 428950;
  const totalOrders = 1248;
  const activeRestaurants = RESTAURANTS.filter(r => r.is_open).length;

  const mockOrders = [
    { id: 'ORD-9842', customer: 'Arun Patel', restaurant: 'Punjab Grill', items: 3, total: 647, status: 'delivered', time: '10 min ago' },
    { id: 'ORD-9841', customer: 'Sneha Roy', restaurant: 'La Piazza', items: 2, total: 848, status: 'on_the_way', time: '18 min ago' },
    { id: 'ORD-9840', customer: 'Vikram Mehta', restaurant: 'Biryani Blues', items: 4, total: 927, status: 'preparing', time: '25 min ago' },
    { id: 'ORD-9839', customer: 'Ananya Deshmukh', restaurant: 'Dosa Republic', items: 2, total: 248, status: 'delivered', time: '42 min ago' },
  ];

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#f36334]/20 text-[#ffb59f] text-[10px] font-bold uppercase tracking-wider border border-[#f36334]/30">
              Platform Admin
            </span>
            <span className="text-xs text-[#a88a81]">Live Control Centre</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">CraveNow Operations</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-xl bg-[#211f1e] hover:bg-[#2b2a28] text-xs font-semibold text-white border border-white/5 flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            Customer View
          </Link>
          <button
            onClick={() => showToast('Platform cache purged and data re-indexed! 🚀')}
            className="px-3 py-1.5 rounded-xl bg-[#f36334] hover:bg-[#d44c20] text-xs font-bold text-white transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Refresh State
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-[#a88a81] font-medium">Total Gross Revenue</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{formatPrice(totalRevenue)}</span>
            <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">↑ 18.4% vs last week</span>
          </div>
        </div>

        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-[#a88a81] font-medium">Orders Processed</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{totalOrders}</span>
            <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">↑ 12.1% completion rate</span>
          </div>
        </div>

        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-[#a88a81] font-medium">Active Kitchens</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{activeRestaurants} / {RESTAURANTS.length}</span>
            <span className="text-[11px] text-[#a88a81] block mt-0.5">All 12 onboarded</span>
          </div>
        </div>

        <div className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-[#a88a81] font-medium">Live Catalog Dishes</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{DISHES.length}</span>
            <span className="text-[11px] text-amber-400 font-bold block mt-0.5">Across 14 cuisines</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-6 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
        {(['overview', 'restaurants', 'orders', 'users'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-[#f36334] text-white'
                : 'bg-[#1c1b1a] text-[#a88a81] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: Overview & Orders */}
      {activeTab === 'overview' || activeTab === 'orders' ? (
        <div className="mt-6 space-y-4">
          <div className="bg-[#1c1b1a] rounded-2xl border border-white/5 p-4">
            <h3 className="font-bold text-white text-sm mb-3">Live Orders Stream</h3>
            <div className="divide-y divide-white/5">
              {mockOrders.map(o => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#211f1e] text-[#f36334] flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{o.id}</span>
                        <span className="text-[11px] text-[#a88a81]">• {o.customer}</span>
                      </div>
                      <p className="text-[11px] text-[#a88a81]">{o.restaurant} • {o.items} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-white block">{formatPrice(o.total)}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      o.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                      o.status === 'on_the_way' ? 'bg-[#f36334]/20 text-[#ffb59f]' : 'bg-amber-400/20 text-amber-400'
                    }`}>
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Tab Content: Restaurants */}
      {activeTab === 'restaurants' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESTAURANTS.map(r => (
            <div key={r.id} className="bg-[#1c1b1a] p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm truncate">{r.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    r.is_open ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {r.is_open ? 'Accepting Orders' : 'Paused'}
                  </span>
                </div>
                <p className="text-[11px] text-[#a88a81] mb-2">{r.cuisine.join(', ')} • {r.address}</p>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                  <span>★ {r.rating}</span>
                  <span className="text-[#a88a81] font-normal">({r.rating_count} reviews)</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                <Link
                  to={`/restaurant/${r.slug}`}
                  className="flex-1 py-1.5 text-center rounded-lg bg-[#211f1e] text-xs font-semibold text-white hover:bg-[#2b2a28]"
                >
                  Menu
                </Link>
                <button
                  onClick={() => showToast(`Status toggled for ${r.name}`)}
                  className="flex-1 py-1.5 rounded-lg bg-[#f36334]/20 text-[#ffb59f] text-xs font-bold hover:bg-[#f36334]/30"
                >
                  Toggle Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Users */}
      {activeTab === 'users' && (
        <div className="mt-6 bg-[#1c1b1a] rounded-2xl border border-white/5 p-4">
          <h3 className="font-bold text-white text-sm mb-3">Registered Users &amp; Roles</h3>
          <div className="space-y-3">
            {[
              { name: 'Priya Sharma', email: 'priya@cravenow.com', role: 'Customer', orders: 12 },
              { name: 'Chef Harpal Singh', email: 'harpal@punjabgrill.in', role: 'Restaurant Owner', orders: 0 },
              { name: 'Rahul Kumar', email: 'rahul.deliveries@cravenow.com', role: 'Delivery Partner', orders: 148 },
              { name: 'System Admin', email: 'admin@cravenow.com', role: 'Super Admin', orders: 0 },
            ].map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#141312] border border-white/5">
                <div>
                  <span className="font-bold text-xs text-white block">{u.name}</span>
                  <span className="text-[11px] text-[#a88a81]">{u.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#f36334] block">{u.role}</span>
                  <span className="text-[10px] text-[#a88a81]">{u.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
