import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const hasClientApiKey = Boolean(firebaseConfig.apiKey);
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
const db = getFirestore(app);
const auth: Auth = hasClientApiKey ? getAuth(app) : unavailableClientService<Auth>('auth');
const storage: FirebaseStorage = hasClientApiKey
  ? getStorage(app)
  : unavailableClientService<FirebaseStorage>('storage');

// Initialize App Check
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

let analyticsPromise: Promise<any> | null = null;
if (typeof window !== 'undefined') {
  analyticsPromise = isSupported().then(yes => yes ? getAnalytics(app) : null);
}

export const getAnalyticsInstance = () => analyticsPromise;

export { app, db, auth, storage };
