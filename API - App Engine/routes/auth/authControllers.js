const { db, admin } = require("../../fire.js");
// const { collection, addDoc } = require("firebase/firestore");

// 1. Function to Register a User
const registerApp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create a User with Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Save User Data to Firestore
    const userData = {
      name,
      email,
      userId: userRecord.uid,
    };

    // Save User Data to Firestore
    await db.collection("users").doc(userRecord.uid).set(userData);

    // Success Response
    res.status(200).json({
      error: false,
      message: "New User Successfully Registered!",
      userId: userRecord.uid,
    });
  } catch (error) {
    // Error Response
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

// 2. Function to Login into the App
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
