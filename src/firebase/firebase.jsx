// firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCi4m4K80LtIXp7y9pfJuTWrB5CHU-9kYY",
  authDomain: "collaboratory-bb361.firebaseapp.com",
  projectId: "collaboratory-bb361",
  storageBucket: "collaboratory-bb361.firebasestorage.app",
  messagingSenderId: "652630818391",
  appId: "1:652630818391:web:9b8ba5518dedb90eaded12",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();

export { auth, db };
