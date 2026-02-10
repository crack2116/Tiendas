'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { supabase } from '@/supabase/client';
import { fetchProfile, upsertProfile } from '@/supabase/db';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (
    email: string,
    password: string,
    additionalData?: Partial<Omit<User, 'uid' | 'email' | 'role'>>
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          const meta = session.user.user_metadata;
          if (profile) {
            setUser(profile);
            // Sincronizar name/address desde user_metadata si el perfil los tiene vacíos (p. ej. recién registrado)
            const needsUpdate =
              (meta?.name && !profile.name) || (meta?.address && !profile.address);
            if (needsUpdate) {
              try {
                await upsertProfile(session.user.id, {
                  name: meta?.name ?? profile.name,
                  address: meta?.address ?? profile.address,
                });
                const updated = await fetchProfile(session.user.id);
                if (updated) setUser(updated);
              } catch {
                // No bloquear si falla la actualización del perfil
              }
            }
          } else {
            setUser({
              uid: session.user.id,
              email: session.user.email || '',
              name: meta?.name,
              address: meta?.address,
              role: 'customer',
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        const meta = session.user.user_metadata;
        if (profile) {
          setUser(profile);
          const needsUpdate =
            (meta?.name && !profile.name) || (meta?.address && !profile.address);
          if (needsUpdate) {
            try {
              await upsertProfile(session.user.id, {
                name: meta?.name ?? profile.name,
                address: meta?.address ?? profile.address,
              });
              const updated = await fetchProfile(session.user.id);
              if (updated) setUser(updated);
            } catch {
              /* ignore */
            }
          }
        } else {
          setUser({
            uid: session.user.id,
            email: session.user.email || '',
            name: meta?.name,
            address: meta?.address,
            role: 'customer',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadSession();
    return () => subscription.unsubscribe();
  }, [router]);

  const signup = async (
    email: string,
    password: string,
    additionalData: Partial<Omit<User, 'uid' | 'email' | 'role'>> = {}
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: additionalData.name,
            address: additionalData.address,
          },
        },
      });
      if (error) throw error;
      // El perfil se crea con el trigger en Supabase (id, email, role).
      // name/address se actualizan en onAuthStateChange cuando ya hay sesión (evita 401 por RLS).
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const authContextValue = {
    user,
    loading,
    isAdmin,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
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
