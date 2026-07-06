import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyD2tZl1i42EpUC7kmIpkulVR-sf_Kj5kOA",
  authDomain: "sierra-blu-system-59b22.firebaseapp.com",
  projectId: "sierra-blu-system-59b22",
  storageBucket: "sierra-blu-system-59b22.firebasestorage.app",
  messagingSenderId: "894977812589",
  appId: "1:894977812589:web:7396d8a9ec9c825eb73764",
  measurementId: "G-MZFRYR32SE",
};

let firebaseApp: FirebaseApp | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (firebaseApp) {
    return firebaseApp;
  }

  firebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  return firebaseApp;
};

export const auth = getAuth(getFirebaseApp());

