/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { db, admin } = require("../../fire.js");
const Joi = require("joi");
const nodemailer = require("nodemailer");
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

// Function to Login into the App and Check Email Verification
const loginApp = async (req, res) => {
  try {
    const { token } = req.body; // Token sent from the client

    // Verify token using Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    if (!userRecord) {
      throw new Error("User not found");
    }

    // Check email verification status directly from userRecord
    if (!userRecord.emailVerified) {
      return res.status(400).json({
        error: true,
        message:
          "Email not verified. Please verify your email before proceeding.",
      });
    }

    // If email is verified, proceed with login
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

// Function to Logout from the App
const logoutApp = async (req, res) => {
  try {
    // Get the token from the request header (Authorization Header)
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({
        error: true,
        message: "No token provided. Please log in first.",
      });
    }

    // Verify token using Admin SDK
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      // If token is valid, revoke the refresh token
      await admin.auth().revokeRefreshTokens(decodedToken.uid);

      // Success Response
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
