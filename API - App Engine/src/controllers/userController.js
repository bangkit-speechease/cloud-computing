// Import the database instance from fire.js
const { db, admin } = require("../services/fire.js");

// 1. Function to Get Specific User Data
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Process of Getting User Data Based on userId
    const userDoc = await db.collection("users").doc(userId).get();

    // Check If User Document Exists
    if (!userDoc.exists) {
      return res.status(404).json({
        error: true,
        message: "User Data Not Found!",
      });
    }

    // Retrieve User Data If Found
    const userData = userDoc.data();

    res.status(200).json({
      error: false,
      message: "User Data Retrieved Successfully!",
      user: userData,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

// 2. Function to Update Specific User Data
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    // User Update Process Based on userId in Firebase Auth
    await admin.auth().updateUser(userId, {
      displayName: name,
      email,
    });

    // User Update Process Based on userId in Firestore
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      name,
      email,
    });

    res.status(200).json({
      error: true,
      message: "User Data Successfully Updated!",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

// 3. Function to Delete Specific User Data
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete User Data from Firestore
    await db.collection("users").doc(userId).delete();

    // Remove User from Firebase Auth
    await admin.auth().deleteUser(userId);

    res.status(200).json({
      error: false,
      message: "Pengguna berhasil dihapus",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
