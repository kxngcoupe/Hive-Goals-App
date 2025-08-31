'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth'; // Keep type for compatibility, but it will be null
import { users } from '@/lib/data';

// Mock Auth Context since Firebase is disconnected

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signIn: (email: string, password:string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock user for prototype purposes when not connected to Firebase
const mockUser = {
  uid: 'mock-user-1',
  email: 'isaiahwcooper@gmail.com',
  displayName: 'Alex Queen',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate auth state check
    // Set a mock user so the dashboard is accessible for prototyping
    setUser(mockUser as User);
    const appUser = users.find(u => u.email === mockUser.email);
    setIsAdmin(appUser?.role === 'Admin');
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError('Firebase is not connected. Cannot sign in.');
    setLoading(false);
    return false;
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError('Firebase is not connected. Cannot sign up.');
    setLoading(false);
    return false;
  };

  const signOut = async () => {
    setLoading(true);
    setUser(null);
    setIsAdmin(false);
    setLoading(false);
  };

  const value = {
    user,
    loading,
    error,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
