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

// Function to Login into the App
const loginApp = async (req, res) => {
  try {
    const { email } = req.body;

    // Authenticate with Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(userRecord.uid);

    // Fetch User Data from Firestore
    const userDoc = await db.collection("users").doc(userRecord.uid).get();

    if (!userDoc.exists) {
      throw new Error("User data not found in Firestore");
    }
    const userData = userDoc.data();

    // Success Response
    res.status(200).json({
      error: false,
      message: "User successfully logged in!",
      loginResult: {
        userId: userRecord.uid,
        name: userData.name,
        token: token,
      },
    });
  } catch (error) {
    // Error Response
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

// 3. Function to Logout from the App
const logoutApp = async (req, res) => {
  try {
    // Lakukan proses logout di sini
    // Misalnya, hapus token yang digunakan oleh pengguna atau sesi yang aktif

    // Success Response
    res.status(200).json({
      error: false,
      message: "User Successfully Logged Out!",
    });
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
