import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }
    
    signIn(email, password);
    showToast('Signed in successfully', 'success');
    navigate('/');
  };

  const handleGuestLogin = () => {
    // For demo purposes, we'll just log them in with dummy data
    signIn('guest@cravenow.com', 'password123');
    showToast('Logged in as Guest', 'success');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] flex flex-col justify-center px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#f36334] mb-2 font-display">CraveNow</h1>
        <p className="text-[#a88a81]">Satisfy your cravings, instantly.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#a88a81] mb-1">Email</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a88a81]">mail</span>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1c1b1a] rounded-xl py-3 pl-10 pr-4 outline-none focus:border focus:border-[#f36334]"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#a88a81] mb-1">Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a88a81]">lock</span>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1c1b1a] rounded-xl py-3 pl-10 pr-4 outline-none focus:border focus:border-[#f36334]"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-[#f36334] text-sm font-medium">Forgot Password?</button>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#f36334] text-white py-3.5 rounded-xl font-medium shadow-[0_4px_14px_0_rgba(243,99,52,0.39)] transition-transform active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      {isDemoMode && (
        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-[#1c1b1a] w-full absolute"></div>
            <span className="bg-[#141312] px-3 text-xs text-[#a88a81] relative">OR</span>
          </div>
          
          <button 
            onClick={handleGuestLogin}
            className="w-full bg-[#1c1b1a] border border-[#2a2826] text-[#e6e1df] py-3.5 rounded-xl font-medium transition-transform active:scale-[0.98]"
          >
            Continue as Guest
          </button>
        </div>
      )}

      <p className="text-center mt-8 text-[#a88a81] text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#f36334] font-medium">Sign Up</Link>
      </p>
    </div>
  );
}
