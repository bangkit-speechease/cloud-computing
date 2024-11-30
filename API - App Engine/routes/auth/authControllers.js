/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { db, admin } = require("../../fire.js");
const Joi = require("joi");
const nodemailer = require("nodemailer");
// const { collection, addDoc } = require("firebase/firestore");

// Buat Transporter untuk Pengiriman Email (melalui Gmail)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fungsi untuk Mengirim Email Verifikasi
const sendVerificationEmail = async (email, verificationLink) => {
  const mailOptions = {
    from: '"SpeechEase" <entalk3@gmail.com>',
    to: email,
    subject: "Email Verification",
    html: `<p>Hi,</p>
           <p>Thank you for registering. Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">Verify Email</a>
           <p>If you didn’t request this, you can safely ignore this email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// Fungsi untuk Mendaftar Pengguna
const registerApp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi Input
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error.message });
    }

    // Cek Apakah Email Sudah Terdaftar
    const existingUser = await admin
      .auth()
      .getUserByEmail(email)
      .catch(() => null);
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "Email is already registered.",
      });
    }

    // Buat Akun Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Simpan Data ke Firestore
    const userData = {
      name,
      email,
      userId: userRecord.uid,
    };
    await db.collection("users").doc(userRecord.uid).set(userData);

    // Kirim Email Verifikasi
    const verificationLink = await admin
      .auth()
      .generateEmailVerificationLink(email);
    await sendVerificationEmail(email, verificationLink);

    // Respons Sukses
    res.status(201).json({
      error: false,
      message: "User registered successfully. Please verify your email.",
      userId: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

// Cloud Function untuk mendeteksi perubahan pengguna
exports.onUserUpdated = functions.auth.user().onUpdate(async (change) => {
  const before = change.before.data(); // Data pengguna sebelum diperbarui
  const after = change.after.data(); // Data pengguna setelah diperbarui

  // Mengecek jika atribut emailVerified telah berubah
  if (before.emailVerified !== after.emailVerified) {
    console.log(`Email verification status changed for user ${after.uid}`);

    // Perbarui status verifikasi di Firestore
    const userRef = admin.firestore().collection("users").doc(after.uid);
    await userRef.update({
      emailVerified: after.emailVerified,
    });

    console.log("Firestore document updated with new emailVerified status");
  }
});

// Function to Login into the App and Check Email Verification
const loginApp = async (req, res) => {
  try {
    const { token } = req.body; // Token yang dikirim dari client

    // Verifikasi token menggunakan Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    if (!userRecord) {
      throw new Error("User not found");
    }

    // Ambil data pengguna dari Firestore untuk memeriksa status verifikasi email
    const userDoc = await db.collection("users").doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: true, message: "User not found." });
    }

    const userData = userDoc.data();

    // Periksa status verifikasi email
    if (!userData.isEmailVerified) {
      return res.status(400).json({
        error: true,
        message:
          "Email not verified. Please verify your email before proceeding.",
      });
    }

    // Jika email sudah diverifikasi, lanjutkan dengan login
    res.status(200).json({
      error: false,
      message: "User successfully logged in!",
      loginResult: {
        userId: userRecord.uid,
        name: userRecord.displayName,
        token: token,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

// 3. Function to Logout from the App
const logoutApp = async (req, res) => {
  try {
    // Ambil token dari request header (Header Authorization)
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({
        error: true,
        message: "No token provided. Please log in first.",
      });
    }

    // Verifikasi token menggunakan Admin SDK
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Jika token valid, cabut refresh token
      await admin.auth().revokeRefreshTokens(decodedToken.uid);

      // Response Sukses
      res.status(200).json({
        error: false,
        message: "User successfully logged out.",
      });
    } catch (error) {
      throw new Error("Invalid token or session expired.");
    }
  } catch (error) {
    // Error Response
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  registerApp,
  loginApp,
  logoutApp,
};
