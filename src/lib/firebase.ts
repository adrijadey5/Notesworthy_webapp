
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

// Check if all required environment variables are present
const areAllVarsDefined = 
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId;

let app;
if (areAllVarsDefined) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} else {
    // In a real app, you might want to throw an error or have a fallback.
    // For this example, we'll log a warning.
    console.warn("Firebase config is incomplete. Firebase will not be initialized.");
}


const auth = areAllVarsDefined ? getAuth(app) : ({} as any);
const firestore = areAllVarsDefined ? getFirestore(app) : ({} as any);

if (process.env.NODE_ENV === 'development' && areAllVarsDefined) {
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
