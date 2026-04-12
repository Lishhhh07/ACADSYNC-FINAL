import admin from 'firebase-admin';


// Initialize Firebase Admin SDK
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Validate Firebase config
if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
  console.error('[Firebase] Missing required Firebase configuration in environment variables');
  console.error('[Firebase] Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  process.exit(1); // 🔥 STOP execution
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('[Firebase] Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('[Firebase] Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
}

export const db = admin.firestore();
export default admin;
