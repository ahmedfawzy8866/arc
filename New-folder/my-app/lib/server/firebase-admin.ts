import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const adminApp = admin.app();
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminAppCheck = admin.appCheck();
