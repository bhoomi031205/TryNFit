import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'trynfit_auth_user_v1';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to load auth user from storage:', e);
      return null;
    }
  });
  const [session, setSession] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Sync profile details from Supabase 'profiles' table
  const fetchUserProfile = useCallback(async (authUser) => {
    if (!authUser || !isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Profile fetch warning:', error);
      }

      const name =
        data?.full_name ||
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split('@')[0] ||
        'Fashion Creator';

      return {
        id: authUser.id,
        email: authUser.email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        avatar:
          data?.avatar_url ||
          authUser.user_metadata?.avatar_url ||
          `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        role: data?.role || 'Fashion Creator',
        joinedAt: data?.created_at || authUser.created_at || new Date().toISOString(),
        isSupabaseUser: true,
      };
    } catch (err) {
      console.error('fetchUserProfile error:', err);
      return null;
    }
  }, []);

  // Listen to real-time Supabase Auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingAuth(false);
      return;
    }

    // Check current active session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const profile = await fetchUserProfile(currentSession.user);
        if (profile) {
          setUser(profile);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
        }
      }
      setIsLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (newSession?.user) {
          const profile = await fetchUserProfile(newSession.user);
          if (profile) {
            setUser(profile);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Sync user state to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth user to localStorage:', e);
    }
  }, [user]);

  /**
   * Login handler: Uses Supabase Auth if configured, with graceful fallback
   */
  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const profile = await fetchUserProfile(data.user);
      const finalUser = profile || {
        id: data.user.id,
        email: data.user.email,
        name: email.split('@')[0],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'Fashion Creator',
        joinedAt: new Date().toISOString(),
        isSupabaseUser: true,
      };

      setUser(finalUser);
      return finalUser;
    }

    // Fallback simulation mode
    await new Promise((resolve) => setTimeout(resolve, 600));
    const name = email.split('@')[0];
    const fallbackUser = {
      id: `user_${Date.now()}`,
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      role: 'Fashion Creator',
      joinedAt: new Date().toISOString(),
      isSupabaseUser: false,
    };
    setUser(fallbackUser);
    return fallbackUser;
  };

  /**
   * Sign up handler: Creates account on Supabase with profile trigger
   */
  const signup = async (name, email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            name: name.trim(),
            avatar_url: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80`,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const profile = await fetchUserProfile(data.user);
        const finalUser = profile || {
          id: data.user.id,
          email: data.user.email,
          name: name.trim() || email.split('@')[0],
          avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80`,
          role: 'Stylist Explorer',
          joinedAt: new Date().toISOString(),
          isSupabaseUser: true,
        };
        setUser(finalUser);
        return finalUser;
      }
    }

    // Fallback mode
    await new Promise((resolve) => setTimeout(resolve, 600));
    const fallbackUser = {
      id: `user_${Date.now()}`,
      email,
      name: name || 'Fashion Enthusiast',
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80`,
      role: 'Stylist Explorer',
      joinedAt: new Date().toISOString(),
      isSupabaseUser: false,
    };
    setUser(fallbackUser);
    return fallbackUser;
  };

  /**
   * OAuth Social Login (Google / GitHub)
   */
  const signInWithOAuth = async (provider) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return data;
  };

  /**
   * Password Reset handler
   */
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Please add your credentials in .env.');
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login?reset=true`,
    });

    if (error) throw error;
    return data;
  };

  /**
   * Quick Demo Account Login (Allows testing without requiring immediate signup)
   */
  const loginAsDemo = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const demoUser = {
      id: 'demo_user_001',
      email: 'alex.fashion@trynfit.ai',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Pro Creator',
      joinedAt: new Date().toISOString(),
      isDemo: true,
      isSupabaseUser: false,
    };
    setUser(demoUser);
    return demoUser;
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut notice:', err);
      }
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: Boolean(user),
        isLoadingAuth,
        isSupabaseEnabled: isSupabaseConfigured,
        login,
        signup,
        signInWithOAuth,
        resetPassword,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
