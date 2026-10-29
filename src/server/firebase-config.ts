import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase, Database } from 'firebase-admin/database';

export function sanitizeDatabaseUrl(raw?: string): string {
  const fallback = 'https://uwu-bot-4cff1-default-rtdb.asia-southeast1.firebasedatabase.app';
  if (!raw) return fallback;

  let clean = raw.trim().replace(/^["']+|["']+$/g, '');
  const urlMatch = clean.match(/https?:\/\/[a-zA-Z0-9._-]+(?:\.asia-southeast1)?\.(?:firebasedatabase\.app|firebaseapp\.com|firebaseio\.com)[^\s)"']*/);
  if (urlMatch) clean = urlMatch[0];
  clean = clean.replace(/\.firebaseapp\.com/g, '.firebasedatabase.app');

  return clean.startsWith('https://') ? clean : fallback;
}

export const FIREBASE_DATABASE_URL = sanitizeDatabaseUrl(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);

let db: Database | null = null;

export function getFirebaseAdminDatabase(): Database {
  if (!db) {
    if (!getApps().length) {
      const credentialsJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (!credentialsJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not configured.');
      }

      let credentials: Record<string, string>;
      try {
        credentials = JSON.parse(credentialsJson);
      } catch {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY must contain valid JSON.');
      }

      if (!credentials.project_id || !credentials.client_email || !credentials.private_key) {
        throw new Error('Firebase service account JSON is missing required fields.');
      }

      initializeApp({
        credential: cert(credentials),
        databaseURL: FIREBASE_DATABASE_URL,
      });
    }
    db = getDatabase(getApps()[0]);
  }
  return db;
}