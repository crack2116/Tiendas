'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// This is a client-only component that initializes Firebase and provides it to its children.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, firestore } = initializeFirebase();

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
