import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/constants';
import { useToast } from '@/contexts/ToastContext';

// Demo data
const ACTIVE_ORDERS = [
  {
    id: 'demo-order-1',
    restaurant: 'Punjab Grill',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&q=80',
    items: ['Butter Chicken', 'Garlic Naan x2'],
    total: 578,
    status: 'on_the_way',
    statusText: 'On the way',
    date: 'Today, 8:45 PM'
  }
];

const PAST_ORDERS = [
  {
    id: 'ord-1234',
    restaurant: 'Pizza Hut',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80',
    items: ['Margherita Pizza (Large)', 'Coke (500ml)'],
    total: 450,
    status: 'delivered',
    statusText: 'Delivered',
    date: '10 Sep, 7:30 PM'
  },
  {
    id: 'ord-1235',
    restaurant: 'Mainland China',
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=300&q=80',
    items: ['Hakka Noodles', 'Chilli Chicken'],
    total: 620,
    status: 'delivered',
    statusText: 'Delivered',
    date: '5 Sep, 1:15 PM'
  },
  {
    id: 'ord-1236',
    restaurant: 'Burger King',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    items: ['Whopper Meal'],
    total: 350,
    status: 'cancelled',
    statusText: 'Cancelled',
    date: '1 Sep, 8:00 PM'
  }
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const { showToast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      case 'on_the_way': return 'bg-[#f36334]/10 text-[#f36334]';
      default: return 'bg-[#1c1b1a] text-[#a88a81]';
    }
  };

  const handleReorder = () => {
    showToast('Items added to cart', 'success');
  };

  const orders = activeTab === 'active' ? ACTIVE_ORDERS : PAST_ORDERS;

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-24">
      <div className="p-4 sticky top-0 bg-[#141312] z-10 border-b border-[#1c1b1a]">
        <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
        
        <div className="flex rounded-lg bg-[#1c1b1a] p-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'active' ? 'bg-[#f36334] text-white' : 'text-[#a88a81]'
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'past' ? 'bg-[#f36334] text-white' : 'text-[#a88a81]'
            }`}
          >
            Past Orders
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-[#a88a81]">
            <span className="material-symbols-outlined text-6xl mb-4">receipt_long</span>
            <p>No {activeTab} orders found.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-[#1c1b1a] p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img src={order.image} alt={order.restaurant} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-semibold">{order.restaurant}</h3>
                    <p className="text-sm text-[#a88a81]">{order.date}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${getStatusColor(order.status)}`}>
                  {order.statusText}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-[#a88a81] mb-2">{order.items.join(', ')}</p>
                <p className="font-semibold">{formatPrice(order.total)}</p>
              </div>
              
              <div className="flex gap-3 border-t border-[#141312] pt-4">
                {order.status === 'on_the_way' ? (
                  <Link 
                    to={`/tracking/${order.id}`}
                    className="flex-1 bg-[#f36334] text-white py-2 rounded-xl text-center font-medium"
                  >
                    Track Order
                  </Link>
                ) : (
                  <button 
                    onClick={handleReorder}
                    className="flex-1 bg-[#f36334] text-white py-2 rounded-xl font-medium"
                  >
                    Reorder
                  </button>
                )}
                <button className="flex-1 bg-[#141312] text-[#e6e1df] py-2 rounded-xl font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
