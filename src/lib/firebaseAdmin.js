import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.resolve(process.cwd(), 'src/public/ubaazar-firebase-config.json');


if (!getApps().length) {
  try {
    console.log("service path is: ", serviceAccountPath);
    
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
}

export default admin;