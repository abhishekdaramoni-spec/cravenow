import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'restaurant'>('customer');
  
  const { signIn, isDemoMode } = useAuth(); // Using signIn for demo purposes
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill all fields', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    // Demo flow: just log them in
    signIn(email, password);
    showToast('Account created successfully!', 'success');
    navigate('/');
  };

  const handleGuestLogin = () => {
    signIn('guest@cravenow.com', 'password123');
    showToast('Logged in as Guest', 'success');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e1df] flex flex-col justify-center px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-display">Create Account</h1>
        <p className="text-[#a88a81]">Join CraveNow and start ordering</p>
      </div>

      <div className="flex bg-[#1c1b1a] rounded-lg p-1 mb-6">
        <button 
          type="button"
          onClick={() => setRole('customer')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === 'customer' ? 'bg-[#f36334] text-white' : 'text-[#a88a81]'}`}
        >
          Customer
        </button>
        <button 
          type="button"
          onClick={() => setRole('restaurant')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === 'restaurant' ? 'bg-[#f36334] text-white' : 'text-[#a88a81]'}`}
        >
          Restaurant Owner
        </button>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#a88a81] mb-1">Full Name</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a88a81]">person</span>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1c1b1a] rounded-xl py-3 pl-10 pr-4 outline-none focus:border focus:border-[#f36334]"
              placeholder="Enter your name"
            />
          </div>
        </div>

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
              placeholder="Create a password"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#a88a81] mb-1">Confirm Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a88a81]">lock_reset</span>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1c1b1a] rounded-xl py-3 pl-10 pr-4 outline-none focus:border focus:border-[#f36334]"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#f36334] text-white py-3.5 rounded-xl font-medium mt-2 shadow-[0_4px_14px_0_rgba(243,99,52,0.39)] transition-transform active:scale-[0.98]"
        >
          Create Account
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

      <p className="text-center mt-6 text-[#a88a81] text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-[#f36334] font-medium">Sign In</Link>
      </p>
    </div>
  );
}
