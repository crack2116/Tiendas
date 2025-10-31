'use server';

import admin from 'firebase-admin';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Admin SDK
try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            storageBucket: firebaseConfig.storageBucket,
        });
    }
} catch (error: any) {
    if (error.code !== 'app/duplicate-app') {
        console.error('Firebase admin initialization error', error);
    }
}

const bucket = admin.storage().bucket();

export async function uploadImageAction(base64: string, fileName: string, contentType: string) {
    try {
        const base64Data = base64.split(';base64,').pop();
        if (!base64Data) {
            throw new Error('Invalid base64 string');
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = `products/${Date.now()}_${fileName}`;
        const file = bucket.file(filePath);

        await file.save(buffer, {
            metadata: {
                contentType: contentType,
            },
        });

        // Make the file public to get a downloadable URL
        await file.makePublic();
        
        return { url: file.publicUrl(), error: null };
    } catch (error: any) {
        console.error("Error uploading image:", error);
        return { url: null, error: error.message };
    }
}
