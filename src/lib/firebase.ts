
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

if (process.env.NODE_ENV === 'development') {
  // To run with emulators, you need to run:
  // firebase emulators:start
  // Uncomment the lines below to use the emulators
  try {
    // connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    // connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  } catch (error) {
    console.error("Error connecting to Firebase emulators. Make sure they are running.", error);
  }
}

export { app, auth, firestore };
