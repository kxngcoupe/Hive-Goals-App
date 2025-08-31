'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User 
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { users } from '@/lib/data';

const auth = getAuth(app);

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // In a real app, you'd fetch the user's role from your database.
        // For this prototype, we'll check the mock data.
        const appUser = users.find(u => u.email === user.email);
        setIsAdmin(appUser?.role === 'Admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        const appUser = users.find(u => u.email === userCredential.user.email);
        setIsAdmin(appUser?.role === 'Admin');
      }
      setLoading(false);
      return true;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // For this prototype, new users will default to 'Member' role.
      // A real application would need a more robust user management system.
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        setIsAdmin(false); // New sign-ups are not admins
      }
      setLoading(false);
      return true;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setIsAdmin(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
