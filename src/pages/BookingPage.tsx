import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RESTAURANTS } from '@/data/restaurants';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice, generateId } from '@/lib/constants';

export default function BookingPage() {
  const { restaurantSlug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const restaurant = RESTAURANTS.find(r => r.slug === restaurantSlug);
  
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [preference, setPreference] = useState('Indoor');
  const [requests, setRequests] = useState('');

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#141312] text-[#e6e1df] p-4 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Restaurant not found</h2>
        <button onClick={() => navigate('/')} className="text-[#f36334] underline">Go Home</button>
      </div>
    );
  }

  const TIME_SLOTS = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'];
  const PREFERENCES = ['Indoor', 'Outdoor', 'Bar', 'Private Dining'];

  const handleConfirm = () => {
    if (!time) {
      showToast('Please select a time slot', 'error');
      return;
    }
    
    const bookingId = generateId();
    showToast(`Booking Confirmed! ID: ${bookingId}`, 'success');
    navigate('/profile'); // Or wherever bookings are shown
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-32">
      {/* Header */}
      <div className="relative h-48">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141312] to-transparent" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-[#141312]/50 p-2 rounded-full backdrop-blur-sm text-white"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="absolute bottom-4 left-4">
          <h1 className="text-2xl font-bold text-white">{restaurant.name}</h1>
          <p className="text-[#a88a81]">{restaurant.cuisine.join(', ')} • {restaurant.location}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Date Selection */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl">
          <h3 className="font-medium mb-3">Select Date</h3>
          <div className="flex gap-3">
            {['Today', 'Tomorrow', 'Day After'].map(d => (
              <button
                key={d}
                onClick={() => setDate(d)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  date === d ? 'bg-[#f36334] text-white' : 'bg-[#141312] text-[#a88a81]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl">
          <h3 className="font-medium mb-3">Select Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                  time === t ? 'bg-[#f36334] text-white' : 'bg-[#141312] text-[#a88a81] border border-[#1c1b1a]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Guests */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl flex items-center justify-between">
          <h3 className="font-medium">Number of Guests</h3>
          <div className="flex items-center gap-4 bg-[#141312] rounded-xl px-2 py-1">
            <button 
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="text-[#a88a81] p-2 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="font-semibold w-4 text-center">{guests}</span>
            <button 
              onClick={() => setGuests(Math.min(10, guests + 1))}
              className="text-[#f36334] p-2 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        {/* Seating Preference */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl">
          <h3 className="font-medium mb-3">Seating Preference</h3>
          <div className="flex flex-wrap gap-2">
            {PREFERENCES.map(pref => (
              <button
                key={pref}
                onClick={() => setPreference(pref)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  preference === pref ? 'bg-[#f36334] text-white' : 'bg-[#141312] text-[#a88a81]'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Special Requests */}
        <div className="bg-[#1c1b1a] p-4 rounded-2xl">
          <h3 className="font-medium mb-3">Special Requests (Optional)</h3>
          <textarea
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="Anniversary, birthday, dietary restrictions..."
            className="w-full bg-[#141312] rounded-xl p-3 outline-none resize-none h-24 text-sm"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1c1b1a] border-t border-[#141312] p-4">
        <button 
          onClick={handleConfirm}
          className="w-full bg-[#f36334] text-white py-4 rounded-xl font-medium flex justify-center items-center gap-2"
        >
          Confirm Booking
          <span className="material-symbols-outlined">event_available</span>
        </button>
      </div>
    </div>
  );
}
