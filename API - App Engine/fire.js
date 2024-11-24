const admin = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Inisialisasi Firebase dengan menggunakan kredensial service account
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount), // gunakan kredensial service account
});

// Inisialisasi Firestore
const db = getFirestore();

module.exports = { db, admin };
