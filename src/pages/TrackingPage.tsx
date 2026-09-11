import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '@/lib/constants';

export default function TrackingPage() {
  const { orderId } = useParams();
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const TIMELINE = [
    { label: 'Confirmed', status: 'completed', time: '8:45 PM' },
    { label: 'Preparing', status: 'completed', time: '8:50 PM' },
    { label: 'Ready', status: 'completed', time: '9:05 PM' },
    { label: 'Picked Up', status: 'completed', time: '9:10 PM' },
    { label: 'On the Way', status: 'current', time: 'Now' },
    { label: 'Delivered', status: 'future', time: 'Est. 9:30 PM' },
  ];

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-24 relative">
      {/* Map Placeholder */}
      <div className="h-[40vh] w-full bg-[#1c1b1a] relative overflow-hidden">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(#a88a81 1px, transparent 1px)', 
          backgroundSize: '24px 24px', 
          opacity: 0.1 
        }} />
        
        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
          <path d="M 50 50 Q 200 150 350 250" fill="none" stroke="#f36334" strokeWidth="4" strokeDasharray="8 8" className="animate-pulse" />
        </svg>

        {/* Restaurant Pin */}
        <div className="absolute top-10 left-10 text-white bg-[#141312] p-2 rounded-full shadow-lg">
          <span className="material-symbols-outlined text-[#f36334]">storefront</span>
        </div>

        {/* Courier Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-[#f36334] p-3 rounded-full shadow-[0_0_20px_rgba(243,99,52,0.5)]">
          <span className="material-symbols-outlined text-white">two_wheeler</span>
        </div>

        {/* User Pin */}
        <div className="absolute bottom-10 right-10 text-white bg-[#141312] p-2 rounded-full shadow-lg">
          <span className="material-symbols-outlined text-emerald-500">home</span>
        </div>
      </div>

      <div className="p-4 bg-[#141312] rounded-t-3xl -mt-6 relative z-10 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Arriving in 15 mins</h2>
          <p className="text-[#a88a81]">Order #{orderId || 'demo-123'}</p>
        </div>

        {/* Delivery Partner */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=11" alt="Courier" />
            </div>
            <div>
              <h3 className="font-semibold">Rahul Kumar</h3>
              <p className="text-sm text-[#a88a81]">Honda Activa • DL-1234</p>
              <div className="flex items-center gap-1 text-sm mt-1">
                <span className="material-symbols-outlined text-[16px] text-[#f36334]">star</span>
                <span>4.9</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-[#141312] flex items-center justify-center text-[#f36334]">
              <span className="material-symbols-outlined">call</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-[#141312] flex items-center justify-center text-[#f36334]">
              <span className="material-symbols-outlined">chat</span>
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[#1c1b1a] p-6 rounded-2xl">
          <h3 className="font-medium mb-4 border-b border-[#141312] pb-3">Track Order</h3>
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#141312]" />
            
            {TIMELINE.map((step, index) => (
              <div key={index} className="relative">
                <div className={`absolute -left-6 w-5 h-5 rounded-full border-4 border-[#1c1b1a] z-10 ${
                  step.status === 'completed' ? 'bg-emerald-500' :
                  step.status === 'current' ? 'bg-[#f36334] animate-pulse' :
                  'bg-[#141312]'
                }`} />
                <div className="flex justify-between items-center -mt-1">
                  <p className={`font-medium ${
                    step.status === 'completed' ? 'text-[#e6e1df]' :
                    step.status === 'current' ? 'text-[#f36334]' :
                    'text-[#a88a81]'
                  }`}>
                    {step.label}
                  </p>
                  <span className="text-xs text-[#a88a81]">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#1c1b1a] rounded-2xl overflow-hidden">
          <button 
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className="w-full p-4 flex justify-between items-center font-medium"
          >
            <span>Order Summary</span>
            <span className="material-symbols-outlined text-[#a88a81]">
              {isSummaryExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {isSummaryExpanded && (
            <div className="p-4 pt-0 border-t border-[#141312] space-y-3">
              <div className="flex justify-between text-sm">
                <span>1x Butter Chicken</span>
                <span>{formatPrice(350)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>2x Garlic Naan</span>
                <span>{formatPrice(100)}</span>
              </div>
              <div className="border-t border-[#141312] pt-2 mt-2 flex justify-between font-semibold">
                <span>Total Paid</span>
                <span>{formatPrice(578)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
