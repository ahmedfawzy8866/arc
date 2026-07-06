/**
 * SIERRA BLU — FIREBASE CLIENT SINGLETON
 * Central Firebase initialization for the frontend.
 * Admin SDK (service-account.json) is for server/scripts only.
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sierra-blu',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const hasClientApiKey = Boolean(firebaseConfig.apiKey);
export const isFirebaseClientConfigured = hasClientApiKey;
const unavailableClientService = <T>(serviceName: string): T =>
  new Proxy(
    {},
    {
      get() {
        throw new Error(
          `Firebase client ${serviceName} is unavailable because NEXT_PUBLIC_FIREBASE_API_KEY is not configured.`
        );
      },
    }
  ) as T;

export const auth: Auth = hasClientApiKey ? getAuth(app) : unavailableClientService<Auth>('auth');
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = hasClientApiKey
  ? getStorage(app)
  : unavailableClientService<FirebaseStorage>('storage');

export async function getAnalyticsInstance() {
  if (typeof window === 'undefined') return null;
  try {
    const { getAnalytics } = await import('firebase/analytics');
    return getAnalytics(app);
  } catch {
    return null;
  }
}

export default app;
