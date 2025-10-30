'use client';
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from 'react';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<FirebaseContextType>({
    app: null,
    auth: null,
    firestore: null,
  });

  useEffect(() => {
    // This ensures that Firebase is only initialized on the client side.
    if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestore = getFirestore(app);
      setValue({ app, auth, firestore });
    }
  }, []);

  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => useFirebase()?.app;
export const useAuthContext = () => useFirebase()?.auth;
export const useFirestore = () => useFirebase()?.firestore;
