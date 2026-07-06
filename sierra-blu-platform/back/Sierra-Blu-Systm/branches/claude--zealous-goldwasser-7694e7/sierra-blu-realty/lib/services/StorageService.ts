import { adminApp, isAdminInitialized } from '../server/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

/**
 * SIERRA BLU STORAGE SERVICE
 * Manages institutional asset storage with high-integrity pathing.
 * Uses lazy initialization to avoid crashing when Firebase Admin is unavailable.
 */
export class StorageService {
  // Lazy-initialized to avoid crashing during build when no Firebase credentials exist
  private static _storage: any = null;
  private static _bucket: any = null;

  private static getStorage() {
    if (!this._storage) {
      if (!isAdminInitialized) {
        throw new Error('Firebase Admin not initialized — storage unavailable');
      }
      const { getStorage } = require('firebase-admin/storage');
      this._storage = getStorage(adminApp);
    }
    return this._storage;
  }

  private static getBucket() {
    if (!this._bucket) {
      const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      this._bucket = this.getStorage().bucket(bucketName);
    }
    return this._bucket;
  }

  /**
   * Uploads base64 media to Firebase Storage.
   * Path: properties/{docId}/{filename}
   */
  static async uploadPropertyMedia(
    docId: string,
    base64Data: string,
    mimeType: string,
    originalName: string = 'upload.jpg'
  ): Promise<string> {
    const bucket = this.getBucket();
    const extension = mimeType.split('/')[1] || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    const filePath = `properties/${docId}/${filename}`;
    const file = bucket.file(filePath);

    const buffer = Buffer.from(base64Data, 'base64');

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName,
          docId,
          source: 'whatsapp'
        }
      },
      public: true
    });

    return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  }
}
