import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string; role: 'admin' | 'member'; full_name: string;
  member_code: string | null; status: string; photo_url: string | null;
  exams_taken?: number; avg_score?: number;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isMember: boolean;
  signIn: (email: string, password: string, role: 'admin' | 'member') => Promise<{ error: string | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Hardcoded demo users — real Supabase auth users were corrupted by SQL seed
// All data (exams, sessions, questions) still fetched live from Supabase DB
const DEMO_USERS: Record<string, { password: string; profile: Profile }> = {
  'admin@srisoultech.com': {
    password: 'admin123',
    profile: {
      id: 'a1aa1111-1a1a-1111-a1a1-111111111110',
      role: 'admin',
      full_name: 'System Admin',
      member_code: 'ADM001',
      status: 'active',
      photo_url: null,
      exams_taken: 0,
      avg_score: 0,
    },
  },
  'member@srisoultech.com': {
    password: 'member123',
    profile: {
      id: 'a2aa2222-2a2a-2222-a2a2-222222222220',
      role: 'member',
      full_name: 'Test Student',
      member_code: 'STU001',
      status: 'active',
      photo_url: null,
      exams_taken: 5,
      avg_score: 78.4,
    },
  },
};

const SESSION_KEY = 'sst_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on page load
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const { email, profile: p } = JSON.parse(raw);
        setUser({ id: p.id, email });
        setProfile(p);
        // Also try to refresh latest profile from Supabase DB
        supabase.from('profiles').select('*').eq('id', p.id).single().then(({ data }) => {
          if (data) setProfile(data as Profile);
        });
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string, role: 'admin' | 'member') => {
    const normalized = email.toLowerCase().trim();
    const demo = DEMO_USERS[normalized];
    if (!demo) return { error: 'Account not found. Use admin@srisoultech.com or member@srisoultech.com' };
    if (demo.password !== password) return { error: 'Incorrect password.' };
    if (demo.profile.role !== role) return { error: `This account is not a ${role}.` };

    const sessionData = { email: normalized, profile: demo.profile };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setUser({ id: demo.profile.id, email: normalized });
    setProfile(demo.profile);
    return { error: null };
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isAdmin: profile?.role === 'admin',
      isMember: profile?.role === 'member',
      signIn, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
