import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, isDemoMode, availableDemoUsers } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (res.error) {
      showToast(res.error.message, 'error');
    } else {
      showToast('Welcome back! Signed in successfully.', 'success');
      navigate('/');
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setIsSubmitting(true);
    const res = await signIn(userEmail, 'password123');
    setIsSubmitting(false);
    if (res.error) {
      showToast(res.error.message, 'error');
    } else {
      showToast(`Logged in as ${userEmail}`, 'success');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] flex flex-col justify-center px-4 sm:px-6 py-12 max-w-md mx-auto w-full">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-2xl bg-[#f36334] flex items-center justify-center shadow-lg shadow-[#f36334]/25">
            <span className="text-white font-black text-xl">C</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight">CraveNow</span>
        </Link>
        <p className="text-xs text-[#a88a81] mt-1">Order delicious food and reserve dining tables.</p>
      </div>

      {/* Login Card */}
      <div className="bg-[#1c1b1a] p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white mb-1">Sign In to Your Account</h2>

        <form onSubmit={handleLogin} className="space-y-3.5">
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
                placeholder="priya@cravenow.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#a88a81]">Password</label>
              <button
                type="button"
                onClick={() => showToast('For demo accounts, use password: password123', 'info')}
                className="text-[11px] text-[#f36334] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a88a81] text-[18px]">
                lock
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141312] border border-white/5 text-white rounded-xl py-3 pl-10 pr-10 text-xs outline-none focus:border-[#f36334] transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a88a81] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
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
                <span>Verifying...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo One-Tap Logins */}
        {isDemoMode && (
          <div className="pt-3 border-t border-white/5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#a88a81] tracking-wider block text-center">
              Quick One-Tap Demo Profiles
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {availableDemoUsers.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.email)}
                  className="p-2 rounded-xl bg-[#141312] hover:bg-[#211f1e] border border-white/5 text-left flex items-center gap-2 transition-colors active:scale-95"
                >
                  <img src={u.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">{u.full_name}</span>
                    <span className="text-[9px] text-[#f36334] uppercase font-semibold">{u.role.replace('_', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-center mt-6 text-[#a88a81] text-xs">
        Don&apos;t have an account yet?{' '}
        <Link to="/signup" className="text-[#f36334] font-bold hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}
