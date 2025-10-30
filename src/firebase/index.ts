import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app, auth, firestore;

function initializeFirebase(options: FirebaseOptions) {
  if (getApps().length === 0) {
    app = initializeApp(options);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  firestore = getFirestore(app);

  return { app, auth, firestore };
}

export {
  initializeFirebase
};
export * from './provider';
export * from './use-user';
export * from './use-collection';
export * from './use-doc';
export * from './client-provider';
