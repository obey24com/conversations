import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Check if Firebase config is available
const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
} : null;

// Initialize Firebase only if config is available
export const firebaseApp = firebaseConfig ? 
  (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]) 
  : null;

export const db = firebaseApp ? getFirestore(firebaseApp) : null;
