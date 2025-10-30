'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    additionalData?: Partial<User>
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { app } = useFirebase();
  const router = useRouter();

  const auth: Auth | null = useMemo(() => (app ? getAuth(app) : null), [app]);
  const firestore: Firestore | null = useMemo(() => (app ? getFirestore(app) : null), [app]);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) {
      // Firebase services are not available yet.
      // The loading state will be handled by the loading check below.
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
          // This case might happen if user doc creation fails after signup
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email! });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const signup = async (
    email: string,
    password: string,
    additionalData: Partial<User> = {}
  ) => {
    if (!auth || !firestore) throw new Error("Firebase not initialized");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);

      const role = email === 'Crismo@gmail.com' ? 'admin' : 'customer';

      const newUser: User = {
        uid: firebaseUser.uid,
        email: email,
        role: role,
        ...additionalData,
      };

      await setDoc(userDocRef, newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not initialized");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase not initialized");
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  // Wait until Firebase is initialized before rendering children
  if (!auth || !firestore) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading Firebase...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
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
