import { initializeApp, cert, getApps, App, ServiceAccount } from 'firebase-admin/app';
import { getDatabase, Database } from 'firebase-admin/database';

export const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = {
  projectId: "uwu-bot-4cff1",
  clientEmail: "firebase-adminsdk-fbsvc@uwu-bot-4cff1.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDiF+paMx6gYN/l\nWFBYrC7r2ypit4G8lcHyw2kztkU7FIMdsglTFgoQ5NdP61JEFRmRlx+m65L8Yp6V\nT5oxlbdQG9cNiPJXdk7JvK0qNfMwCKJgCx+6quklwFjYRr0n3B8TYOtrHnR6WqVi\nL+7K9CzsalU6qn1GSMj7iRZ8Hk6Tat9xQkBFiNQOhLmACRa4kJtpP/zi9r1W84rD\nGRqXKrZCwlIsJVY885PxEcy3ake8Hoz4Il9n5Mxhy6DmIGb3x/vKpBKnAO1XbT1G\nL2q8kkL6UXi4tG4MuP3oFGJ9gohDPd4H3v/4bWTWq33vTk25PvDHbvsIzEilEeap\nmizJFGu5AgMBAAECggEAbvqAPUBEc0K6BBCCd9Qkv/73YjdjRldYOTp0JD7+4o4i\nAeyHKTJzRHGfwonm+qZEw7MjhUKzBpG999p3/IjZz0erGuiy0/2tlNa5RTPwKA7E\n7VHohC8qfC5bLeYjKTKiSlfTluP/FqPx9C1FEHgkqPNU3JQdI+fMR7O1xrz1ouPx\ne0O5Kp3qDgkogho6F0m6OeXl+BHsgdbiKcW5Crm2F3lQmIcHEc2vSwScuBobD7gf\ndgjIufFTnjAT2Sc6BWn4aMz8JJ3h0lflmxp0f0uSRRXWE0/GeMoPOaT51Ur7GlD3\nzCGrln8pbgkI82J2Gu5RlDKR2mpx9XrcRp5x8AWqlQKBgQD3pmA1nqWTFEpsvXYS\nvgj4CP7QmQu/jCUdjE6mNwEiDu/fCepr4291KMnFLqmMb4Mh139NVWsKp5sn7qyl\nmMJBm5VqQTmb2BAE6Ox9UPUSkuXnOfUnhYlNjPaOkAkXSs9GP2iC7leFKp+NnNGe\nLAKs19MZBeTgxWgvzxOAcgmRHwKBgQDpt3jLQ5JS6DuqDqeT0JvSzvkNC8ZlYg1u\nC112tCkomeliUdyRpLye/t+xziPKikeozO7fR1L3Es3E/sfmzOXturuBYf+T5aRp\nn8gZbAb8XpoW4KOt0WwGr7VJwloDGa4KePmTCrdTXQ1W57QmH1MRoSh1xGI77CJw\nS19RDOawJwKBgQCuwOLHM4oXPYw/K3q0QxFFJePaAwV9R0Gxlh6xv8K2699sfizD\nsRwnin7G++R8yvu3179nLM16GUetaAjAWglKDqXi8t/aDx9Ot6aZz5UAZFSDVCyg\nlOSMqtoZQ56Gpy2Ynon7SoDL4YXxgiWQ/fFtUmcOE1CtI+AfTHqwesgxdQKBgF34\n7nHUPo5lYDAVal3tv+m4XL1ZIbF8Bmhb232yHOZ9VDC7N5O8CDdpxanpd8ylYwDF\nPbq7I+nCPshZpSjw8/ZtYZ05ORlPeZcarstB+2EX7J8MPePS07uwhJUetzCN78O4\nNqlf4qx7OrTZvz6g07a/9NO9Xb44SPSb6bxeEpd7AoGBAJocux4HB51vzk5MWtYC\nE2G/4sNcLW98mIAgfpzvmVnh1dGr6KyfCfkQDEbTaJNpMR4R+JXezBuudfEtHLWs\ny3c6hMsG+IfB5c3t7qZv3ToQz6qNrJsCCxokg5OgSD1zKRBw9BQUkAFQQNqCbMzQ\n6WjvE8cmnP27T1fr4IFIA1kI\n-----END PRIVATE KEY-----\n",
};

export function sanitizeDatabaseUrl(raw?: string): string {
  const fallback = "https://uwu-bot-4cff1-default-rtdb.asia-southeast1.firebasedatabase.app";
  if (!raw) return fallback;
  
  // Extract URL from markdown format [url](url) or surrounding quotes/spaces
  let clean = raw.trim().replace(/^["']+|["']+$/g, '');
  const urlMatch = clean.match(/https?:\/\/[a-zA-Z0-9._-]+(?:\.asia-southeast1)?\.(?:firebasedatabase\.app|firebaseapp\.com|firebaseio\.com)[^\s)"']*/);
  if (urlMatch) {
    clean = urlMatch[0];
  } else {
    const genericMatch = clean.match(/https?:\/\/[^\s)"']+/);
    if (genericMatch) clean = genericMatch[0];
  }

  // Firebase Realtime Database URLs must end with .firebasedatabase.app (or .firebaseio.com), never .firebaseapp.com
  clean = clean.replace(/\.firebaseapp\.com/g, '.firebasedatabase.app');
  
  if (!clean.startsWith('https://')) return fallback;
  return clean;
}

export const FIREBASE_DATABASE_URL = sanitizeDatabaseUrl(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);

let app: App | null = null;
let db: Database | null = null;

export function getFirebaseAdminDatabase(): Database {
  if (!db) {
    if (!getApps().length) {
      let cred = cert(FIREBASE_SERVICE_ACCOUNT);
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
          const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          cred = cert(parsed);
        } catch {
          // If already an object or unescaped string, fallback safely
          cred = cert(FIREBASE_SERVICE_ACCOUNT);
        }
      }

      app = initializeApp({
        credential: cred,
        databaseURL: FIREBASE_DATABASE_URL,
      });
    } else {
      app = getApps()[0];
    }
    db = getDatabase(app);
  }
  return db;
}
