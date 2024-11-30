// Firebase Admin SDK for admin functionalities
const admin = require("firebase-admin");

// Initialize app with credentials
const { initializeApp, cert } = require("firebase-admin/app");

// Access Firestore database
const { getFirestore } = require("firebase-admin/firestore");

// Import the service account credentials for Firebase Admin SDK
const serviceAccount = require("../../serviceAccountKey.json");

// Initialize Firebase Admin SDK with the service account credentials
initializeApp({
  credential: cert(serviceAccount),
});

// Initialize Firestore database instance to interact with Firestore
const db = getFirestore();

module.exports = { db, admin };
