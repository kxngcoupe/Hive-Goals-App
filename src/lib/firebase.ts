import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  projectId: "beegoals",
  appId: "1:22591756526:web:a320ac84107c90f6ab7bff",
  storageBucket: "beegoals.firebasestorage.app",
  apiKey: "AIzaSyAqj3wkWhT11cpAF-UCfeFaDtCHXxLeCQU",
  authDomain: "beegoals.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "22591756526"
};

const app = initializeApp(firebaseConfig);

export { app };
