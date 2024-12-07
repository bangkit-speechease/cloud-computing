/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { db, admin } = require("../services/fire.js");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // Import JWT
// const { collection, addDoc } = require("firebase/firestore");

// Create a Transporter for Sending Emails (via Gmail)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to Send Verification Email
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

// Function to Register User
const registerApp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate Input
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error.message });
    }

    // Check if Email is Already Registered
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

    // Create Firebase Account
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Save Data to Firestore
    const userData = {
      name,
      email,
      password,
      userId: userRecord.uid,
    };
    await db.collection("users").doc(userRecord.uid).set(userData);

    // Send Verification Email
    const verificationLink = await admin
      .auth()
      .generateEmailVerificationLink(email);
    await sendVerificationEmail(email, verificationLink);

    // Success Response
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

// Fungsi untuk membuat token JWT
const createToken = async (uid) => {
  try {
    // Buat payload dengan UID pengguna
    const payload = { uid };

    // Buat token dengan expiration time (misalnya, 1 jam)
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    console.error("Gagal membuat token:", error.message);
    throw error;
  }
};

// Function to Login into the App
const loginApp = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ambil data pengguna dari Firestore berdasarkan email
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });
    }

    // Ambil data pengguna
    const userData = userSnapshot.docs[0].data();

    // Cocokkan password
    if (userData.password !== password) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });
    }

    // Jika password cocok, buat token
    const token = await createToken(userData.userId);

    // Response berhasil dengan format yang diminta
    res.status(200).json({
      error: false,
      message: "success",
      loginResult: {
        userId: userData.userId,
        name: userData.name,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

// Fungsi untuk logout dari aplikasi
const logoutApp = async (req, res) => {
  try {
    // Ambil token dari header permintaan (Authorization Header)
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        error: true,
        message: "No token provided. Please log in first.",
      });
    }

    // Verifikasi token
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Buat token baru dengan masa berlaku sangat singkat (misalnya 1 detik)
      const expiredToken = jwt.sign(
        { uid: decodedToken.uid },
        process.env.JWT_SECRET,
        { expiresIn: "1s" } // Masa berlaku token hanya 1 detik
      );

      // Response sukses dengan token yang sudah tidak valid
      res.status(200).json({
        error: false,
        message: "User successfully logged out.",
        token: expiredToken, // Token ini sudah tidak berlaku dalam 1 detik
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
