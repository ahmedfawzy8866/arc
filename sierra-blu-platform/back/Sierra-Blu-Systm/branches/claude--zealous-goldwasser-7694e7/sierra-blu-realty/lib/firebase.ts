import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD2tZl1i42EpUC7kmIpkulVR-sf_Kj5kOA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sierra-blu-system-59b22.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sierra-blu-system-59b22",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sierra-blu-system-59b22.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "894977812589",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:894977812589:web:7396d8a9ec9c825eb73764",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MZFRYR32SE",
};

let firebaseApp: FirebaseApp | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (firebaseApp) {
    return firebaseApp;
  }

  firebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  return firebaseApp;
};

export const app = getFirebaseApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

