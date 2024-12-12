/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { db, admin } = require("../services/fire.js");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/verifyEmail.js");
const createToken = require("../utils/sendToken.js");
const { hashPassword, verifyPassword } = require("../utils/verifyPassword.js");

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

    const hashedPassword = await hashPassword(password);

    // Save Data to Firestore
    const userData = {
      name,
      email,
      hashedPassword,
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

    console.log(userData);

    // Cek apakah email sudah diverifikasi
    try {
      // Ambil data user berdasarkan email
      const user = await admin.auth().getUserByEmail(email);

      // Periksa properti emailVerified
      if (!user.emailVerified) {
        return res.status(401).json({
          error: true,
          message:
            "Email belum diverifikasi, Mohon untuk verifikasi email anda terlebih dahulu.",
        });
      }
    } catch (error) {
      console.error("Error saat memeriksa verifikasi email:", error);
      throw error;
    }

    const userPassword = userData.hashedPassword;

    // Cocokkan password
    if (!verifyPassword(password, userPassword)) {
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

module.exports = {
  registerApp,
  loginApp,
};
