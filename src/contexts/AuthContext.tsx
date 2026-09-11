import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { supabase, isDemo } from '@/lib/supabase';
import { StorageService, DEFAULT_USERS } from '@/services/storageService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  availableDemoUsers: UserProfile[];
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, pass: string, full_name: string, role: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  switchDemoUser: (userId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (isDemo) {
      return StorageService.getActiveUser();
    }
    return null;
  });
  const [loading, setLoading] = useState(!isDemo);

  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      return;
    }

    const fetchUser = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        setUser(data);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string): Promise<{ error: Error | null }> => {
    if (isDemo) {
      const cleanEmail = email.trim().toLowerCase();
      const allUsers = StorageService.getUsers();
      const found = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

      if (!found) {
        return { error: new Error('No account found with this email address. Please sign up or try priya@cravenow.com') };
      }

      if (found.password && found.password !== pass) {
        return { error: new Error('Incorrect password. For demo accounts, the password is password123') };
      }

      setUser(found);
      StorageService.setActiveUser(found);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, pass: string, full_name: string, role: string): Promise<{ error: Error | null }> => {
    if (!email || !email.includes('@')) {
      return { error: new Error('Please provide a valid email address') };
    }
    if (!pass || pass.length < 6) {
      return { error: new Error('Password must be at least 6 characters long') };
    }

    if (isDemo) {
      const cleanEmail = email.trim().toLowerCase();
      const allUsers = StorageService.getUsers();
      if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { error: new Error('An account with this email already exists. Please sign in instead.') };
      }

      const newUser: UserProfile & { password?: string } = {
        id: `usr-${Date.now()}`,
        full_name: full_name.trim() || 'Food Lover',
        name: full_name.trim() || 'Food Lover',
        email: cleanEmail,
        phone: '+91 98765 00000',
        avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop`,
        role: (role as UserRole) || 'customer',
        created_at: new Date().toISOString(),
        password: pass,
      };

      StorageService.saveUser(newUser);
      setUser(newUser);
      StorageService.setActiveUser(newUser);
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name,
          role,
        },
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (isDemo) {
      setUser(null);
      StorageService.setActiveUser(null);
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error: error ? new Error(error.message) : null };
  };

  const resetPassword = async (email: string) => {
    if (isDemo) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error ? new Error(error.message) : null };
  };

  const switchDemoUser = (userId: string) => {
    const allUsers = StorageService.getUsers();
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setUser(target);
      StorageService.setActiveUser(target);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...updates,
      name: updates.full_name || updates.name || user.name || user.full_name,
    };
    setUser(updated);
    if (isDemo) {
      StorageService.saveUser(updated);
      StorageService.setActiveUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isDemoMode: isDemo,
        availableDemoUsers: DEFAULT_USERS,
        signIn,
        signUp,
        signOut,
        resetPassword,
        switchDemoUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
