import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { StorageService } from '@/services/storageService';
import type { Address } from '@/types';

export default function ProfilePage() {
  const { user, isDemoMode, signOut, availableDemoUsers, switchDemoUser, updateProfile } = useAuth();
  const { favoriteRestaurantIds, favoriteDishIds } = useFavorites();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const userId = user?.id || 'guest';
  const orders = StorageService.getUserOrders(userId);
  const addresses = StorageService.getUserAddresses(userId);

  const [activeModal, setActiveModal] = useState<'addresses' | 'edit' | 'switch_user' | null>(null);
  const [editName, setEditName] = useState(user?.name || user?.full_name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  // New address state
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddress, setNewAddress] = useState('');

  const handleSignOut = () => {
    signOut();
    navigate('/login');
    showToast('Signed out successfully', 'info');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: editName.trim(),
      name: editName.trim(),
      phone: editPhone.trim(),
    });
    setActiveModal(null);
    showToast('Profile updated successfully!', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const created: Address = {
      id: `addr-${Date.now()}`,
      user_id: userId,
      label: newLabel,
      full_address: newAddress.trim(),
      lat: 12.9352,
      lng: 77.6245,
      is_default: addresses.length === 0,
      created_at: new Date().toISOString(),
    };
    StorageService.saveAddress(userId, created);
    setNewAddress('');
    showToast('Address added to your account', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    StorageService.deleteAddress(userId, id);
    showToast('Address removed', 'info');
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] pb-36 max-w-3xl mx-auto">
      {/* Header Profile Card */}
      <div className="p-6 bg-[#1c1b1a] rounded-b-3xl border-b border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Account &amp; Profile</h1>
          <button
            onClick={() => {
              setEditName(user?.name || user?.full_name || '');
              setEditPhone(user?.phone || '');
              setActiveModal('edit');
            }}
            className="text-xs text-[#f36334] font-bold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit Profile</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#f36334] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 border-2 border-white/10 shadow-lg">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              (user?.name || 'User').charAt(0)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white truncate">{user?.name || user?.full_name || 'Foodie'}</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#f36334]/20 text-[#ffb59f] border border-[#f36334]/30">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-[#a88a81] truncate">{user?.email || 'guest@cravenow.com'}</p>
            <p className="text-xs text-[#a88a81] mt-0.5">{user?.phone || '+91 98765 43210'}</p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="bg-[#211f1e] border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffba49] text-[18px]">verified_user</span>
              <span className="text-neutral-300">Local Multi-User Simulation</span>
            </div>
            <button
              onClick={() => setActiveModal('switch_user')}
              className="px-2.5 py-1 rounded-lg bg-[#f36334]/20 hover:bg-[#f36334]/30 text-[#ffb59f] text-[11px] font-bold transition-colors"
            >
              Switch Account
            </button>
          </div>
        )}

        {/* Real User Statistics */}
        <div className="grid grid-cols-4 gap-2.5">
          <Link to="/orders" className="text-center bg-[#141312] border border-white/5 rounded-2xl p-3 hover:border-white/15 transition-all">
            <p className="text-lg font-black text-[#f36334] font-mono">{orders.length}</p>
            <p className="text-[10px] text-[#a88a81] uppercase tracking-wider font-bold mt-0.5">Orders</p>
          </Link>
          <Link to="/favorites" className="text-center bg-[#141312] border border-white/5 rounded-2xl p-3 hover:border-white/15 transition-all">
            <p className="text-lg font-black text-[#f36334] font-mono">
              {favoriteRestaurantIds.length + favoriteDishIds.length}
            </p>
            <p className="text-[10px] text-[#a88a81] uppercase tracking-wider font-bold mt-0.5">Saved</p>
          </Link>
          <button
            onClick={() => setActiveModal('addresses')}
            className="text-center bg-[#141312] border border-white/5 rounded-2xl p-3 hover:border-white/15 transition-all"
          >
            <p className="text-lg font-black text-[#f36334] font-mono">{addresses.length}</p>
            <p className="text-[10px] text-[#a88a81] uppercase tracking-wider font-bold mt-0.5">Addresses</p>
          </button>
          <div className="text-center bg-[#141312] border border-white/5 rounded-2xl p-3">
            <p className="text-lg font-black text-emerald-400 font-mono">350</p>
            <p className="text-[10px] text-[#a88a81] uppercase tracking-wider font-bold mt-0.5">Points</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="p-4 space-y-2.5">
        <button 
          onClick={() => setActiveModal('addresses')}
          className="w-full flex items-center justify-between bg-[#1c1b1a] hover:bg-[#211f1e] p-4 rounded-2xl border border-white/5 active:scale-[0.99] transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">location_on</span>
            <div>
              <span className="font-bold text-xs text-white block">Manage Saved Addresses</span>
              <span className="text-[11px] text-[#a88a81]">{addresses.length} delivery addresses saved</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[18px]">chevron_right</span>
        </button>

        <Link
          to="/orders"
          className="w-full flex items-center justify-between bg-[#1c1b1a] hover:bg-[#211f1e] p-4 rounded-2xl border border-white/5 active:scale-[0.99] transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">receipt_long</span>
            <div>
              <span className="font-bold text-xs text-white block">Order History &amp; Receipts</span>
              <span className="text-[11px] text-[#a88a81]">View past invoices and re-order</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[18px]">chevron_right</span>
        </Link>

        <Link
          to="/favorites"
          className="w-full flex items-center justify-between bg-[#1c1b1a] hover:bg-[#211f1e] p-4 rounded-2xl border border-white/5 active:scale-[0.99] transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f36334] text-[20px]">favorite</span>
            <div>
              <span className="font-bold text-xs text-white block">Favorite Dishes &amp; Restaurants</span>
              <span className="text-[11px] text-[#a88a81]">Saved dining spots</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#a88a81] text-[18px]">chevron_right</span>
        </Link>

        {/* Partner & Staff shortcuts */}
        <div className="pt-3">
          <span className="text-[10px] text-[#a88a81] uppercase font-bold tracking-wider px-2 block mb-2">Partner Portals</span>
          <div className="grid grid-cols-3 gap-2">
            <Link
              to="/partner/restaurant"
              className="bg-[#1c1b1a] hover:bg-[#211f1e] p-3 rounded-2xl border border-white/5 text-center flex flex-col items-center gap-1"
            >
              <span className="text-lg">👨‍🍳</span>
              <span className="text-[11px] font-bold text-white">Kitchen Portal</span>
            </Link>
            <Link
              to="/partner/delivery"
              className="bg-[#1c1b1a] hover:bg-[#211f1e] p-3 rounded-2xl border border-white/5 text-center flex flex-col items-center gap-1"
            >
              <span className="text-lg">🛵</span>
              <span className="text-[11px] font-bold text-white">Rider Portal</span>
            </Link>
            <Link
              to="/admin"
              className="bg-[#1c1b1a] hover:bg-[#211f1e] p-3 rounded-2xl border border-white/5 text-center flex flex-col items-center gap-1"
            >
              <span className="text-lg">📊</span>
              <span className="text-[11px] font-bold text-white">Admin Console</span>
            </Link>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-5">
          <button 
            onClick={handleSignOut}
            className="w-full bg-[#1c1b1a] text-red-400 border border-red-500/20 hover:bg-red-500/10 p-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      {/* Modal: Manage Addresses */}
      {activeModal === 'addresses' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1b1a] rounded-3xl border border-white/10 p-5 max-w-md w-full max-h-[85vh] overflow-y-auto custom-scrollbar space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-bold text-base text-white">Saved Delivery Addresses</h3>
              <button onClick={() => setActiveModal(null)} className="text-[#a88a81] hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Existing addresses */}
            <div className="space-y-2.5">
              {addresses.map(addr => (
                <div key={addr.id} className="p-3 bg-[#141312] rounded-2xl border border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{addr.label}</span>
                      {addr.is_default && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#a88a81] mt-0.5">{addr.full_address}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-[#a88a81] hover:text-red-400 p-1"
                    title="Delete address"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add new address */}
            <form onSubmit={handleAddAddress} className="pt-2 border-t border-white/5 space-y-2.5">
              <span className="text-xs font-bold text-white block">Add New Address</span>
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setNewLabel(l)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${newLabel === l ? 'bg-[#f36334] text-white' : 'bg-[#141312] text-[#a88a81]'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <textarea
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                placeholder="Full delivery address with landmark and pincode..."
                rows={2}
                className="w-full bg-[#141312] text-white text-xs p-3 rounded-xl border border-white/5 outline-none focus:border-[#f36334] resize-none"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#f36334] hover:bg-[#d44c20] text-white text-xs font-bold transition-colors"
              >
                Save New Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Profile */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveProfile} className="bg-[#1c1b1a] rounded-3xl border border-white/10 p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-bold text-base text-white">Edit Your Profile</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-[#a88a81] hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#a88a81] block mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#141312] border border-white/5 text-white p-2.5 rounded-xl outline-none focus:border-[#f36334]"
                  required
                />
              </div>
              <div>
                <label className="text-[#a88a81] block mb-1 font-bold">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full bg-[#141312] border border-white/5 text-white p-2.5 rounded-xl outline-none focus:border-[#f36334]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#f36334] text-white text-xs font-bold hover:bg-[#d44c20] transition-colors"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Modal: Switch Demo Account */}
      {activeModal === 'switch_user' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1b1a] rounded-3xl border border-white/10 p-5 max-w-sm w-full space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-bold text-base text-white">Switch Simulated Account</h3>
              <button onClick={() => setActiveModal(null)} className="text-[#a88a81] hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-[#a88a81]">
              Switching accounts isolates the cart, orders, addresses, and favorites completely for each user persona.
            </p>
            <div className="space-y-2">
              {availableDemoUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    switchDemoUser(u.id);
                    setActiveModal(null);
                    showToast(`Switched account to ${u.full_name} (${u.role})`, 'success');
                  }}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    user?.id === u.id
                      ? 'bg-[#f36334]/15 border-[#f36334]'
                      : 'bg-[#141312] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-white block">{u.full_name}</span>
                      <span className="text-[10px] text-[#a88a81] capitalize">{u.role.replace('_', ' ')}</span>
                    </div>
                  </div>
                  {user?.id === u.id && (
                    <span className="text-xs text-[#f36334] font-bold">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
