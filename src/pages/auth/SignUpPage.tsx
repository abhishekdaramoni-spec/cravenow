import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { UserRole } from '@/types';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await signUp(email.trim(), password, name.trim(), role);
    setIsSubmitting(false);

    if (res.error) {
      showToast(res.error.message, 'error');
    } else {
      showToast(`Welcome to CraveNow, ${name}! Your account is ready. 🎉`, 'success');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] flex flex-col justify-center px-4 sm:px-6 py-12 max-w-md mx-auto w-full">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-2xl bg-[#f36334] flex items-center justify-center shadow-lg shadow-[#f36334]/25">
            <span className="text-white font-black text-xl">C</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight">CraveNow</span>
        </Link>
        <h1 className="text-xl font-bold text-white mt-1">Create an Account</h1>
        <p className="text-xs text-[#a88a81] mt-0.5">Start ordering your favorite food across top restaurants</p>
      </div>

      <div className="bg-[#1c1b1a] p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
        {/* Role Selector Tabs */}
        <div className="flex bg-[#141312] rounded-2xl p-1 border border-white/5">
          <button 
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'customer'
                ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/20'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            Customer
          </button>
          <button 
            type="button"
            onClick={() => setRole('restaurant_owner')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'restaurant_owner'
                ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/20'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            Kitchen Owner
          </button>
          <button 
            type="button"
            onClick={() => setRole('delivery_partner')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'delivery_partner'
                ? 'bg-[#f36334] text-white shadow-md shadow-[#f36334]/20'
                : 'text-[#a88a81] hover:text-white'
            }`}
          >
            Rider
          </button>
        </div>

        <form onSubmit={handleSignUp} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#a88a81] mb-1">Full Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a88a81] text-[18px]">
                person
              </span>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#141312] border border-white/5 text-white rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#f36334] transition-colors"
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#a88a81] mb-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a88a81] text-[18px]">
                mail
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141312] border border-white/5 text-white rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#f36334] transition-colors"
                placeholder="name@domain.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#a88a81] mb-1">Password (min 6 characters)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a88a81] text-[18px]">
                lock
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141312] border border-white/5 text-white rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#f36334] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#a88a81] mb-1">Confirm Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a88a81] text-[18px]">
                lock_clock
              </span>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#141312] border border-white/5 text-white rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#f36334] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f36334] hover:bg-[#d44c20] text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-[#f36334]/25 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>
      </div>

      <p className="text-center mt-6 text-[#a88a81] text-xs">
        Already have an account?{' '}
        <Link to="/login" className="text-[#f36334] font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
