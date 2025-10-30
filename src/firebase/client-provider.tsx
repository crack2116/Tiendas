'use client';

import { firebaseConfig } from './config';
import { initializeFirebase, FirebaseProvider } from '.';

initializeFirebase(firebaseConfig);

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
