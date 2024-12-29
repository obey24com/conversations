import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBw3eUPlSZZ_fDK8Q7-NJG6CGSI36GQbA0",
  authDomain: "ulocatcom.firebaseapp.com",
  databaseURL: "https://ulocatcom-default-rtdb.firebaseio.com",
  projectId: "ulocatcom",
  storageBucket: "ulocatcom.firebasestorage.app",
  messagingSenderId: "444730804587",
  appId: "1:444730804587:web:8fdf7031bf7d06e351a42e",
  measurementId: "G-JVTY5SWGHY"
};

// Initialize Firebase
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(firebaseApp);
