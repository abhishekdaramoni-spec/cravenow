import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ProfilePage() {
  const { user, isDemoMode, signOut } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
    showToast('Signed out successfully', 'info');
  };

  const menuItems = [
    { icon: 'location_on', label: 'Saved Addresses' },
    { icon: 'payment', label: 'Payment Methods' },
    { icon: 'notifications', label: 'Notifications' },
    { icon: 'help', label: 'Help & Support' },
    { icon: 'info', label: 'About CraveNow' },
  ];

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-24">
      {/* Header */}
      <div className="p-6 bg-[#1c1b1a] rounded-b-3xl mb-6">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-[#f36334] rounded-full flex items-center justify-center text-white text-3xl font-semibold">
            {user?.name?.charAt(0) || 'G'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || 'Guest User'}</h2>
            <p className="text-[#a88a81]">{user?.email || 'guest@cravenow.com'}</p>
            <p className="text-[#a88a81] text-sm mt-1">{user?.phone || '+91 98765 43210'}</p>
          </div>
        </div>

        {isDemoMode && (
          <div className="bg-[#f36334]/10 border border-[#f36334]/20 p-3 rounded-xl mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f36334]">info</span>
            <p className="text-sm text-[#f36334]">You are currently in demo mode.</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Orders', value: '12' },
            { label: 'Favorites', value: '8' },
            { label: 'Bookings', value: '3' },
            { label: 'Reviews', value: '5' }
          ].map(stat => (
            <div key={stat.label} className="text-center bg-[#141312] rounded-xl p-3">
              <p className="text-xl font-semibold text-[#f36334]">{stat.value}</p>
              <p className="text-[10px] text-[#a88a81] uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-2 mb-8">
        {menuItems.map(item => (
          <button 
            key={item.label}
            className="w-full flex items-center justify-between bg-[#1c1b1a] p-4 rounded-xl active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a88a81]">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
            <span className="material-symbols-outlined text-[#a88a81]">chevron_right</span>
          </button>
        ))}
      </div>

      {/* Sign Out Button */}
      <div className="px-4">
        <button 
          onClick={handleSignOut}
          className="w-full bg-[#1c1b1a] text-[#e6e1df] border border-red-500/30 hover:border-red-500 hover:text-red-500 p-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </div>
    </div>
  );
}
