const jwt = require("jsonwebtoken");

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

module.exports = createToken;
