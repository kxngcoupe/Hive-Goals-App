import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "beegoals",
  appId: "1:22591756526:web:a320ac84107c90f6ab7bff",
  storageBucket: "beegoals.firebasestorage.app",
  apiKey: "AIzaSyAqj3wkWhT11cpAF-UCfeFaDtCHXxLeCQU",
  authDomain: "beegoals.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "22591756526"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
