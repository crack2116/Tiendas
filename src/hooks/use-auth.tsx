'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuthContext, useFirestore } from '@/firebase';
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
  const auth = useAuthContext();
  const firestore = useFirestore();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // This effect runs once to set up the auth state listener.
    // It will automatically update the user state on login, logout, or token refresh.
    if (!auth) return; // Wait for Firebase to be initialized

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        // If the user is logged in, fetch their profile from Firestore.
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = { uid: firebaseUser.uid, ...userDoc.data() } as User;
          setUser(userData);
        } else {
           // This case can happen if the Firestore document creation failed after signup.
           // We set a minimal user object to prevent the app from breaking.
           setUser({ uid: firebaseUser.uid, email: firebaseUser.email! });
        }
      } else {
        // If the user is logged out, clear the user state.
        setUser(null);
      }
      // Set loading to false once we have the initial auth state.
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, firestore, router]);

  const signup = async (
    email: string,
    password: string,
    additionalData: Partial<Omit<User, 'uid' | 'email' | 'role'>> = {}
  ) => {
    setLoading(true);
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      
      // 2. All new signups are customers
      const role = 'customer';

      // 3. Prepare user data for Firestore
      const newUser: User = {
        uid: firebaseUser.uid,
        email: email,
        name: additionalData.name || '',
        address: additionalData.address || '',
        role: role,
      };

      // 4. Create user document in Firestore
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      await setDoc(userDocRef, newUser);

      // The onAuthStateChanged listener will automatically update the local user state.
      // We don't need to call setUser here.
      
    } catch (error) {
      console.error('Error signing up:', error);
      // Re-throw the error so the UI can catch it and display a message
      throw error;
    } finally {
      // ALWAYS stop loading, whether it succeeded or failed.
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user state and redirection.
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
       setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will clear the user state.
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
