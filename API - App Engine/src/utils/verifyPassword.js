const bcrypt = require("bcrypt");

async function verifyPassword(plainPassword, hash) {
  const isMatch = await bcrypt.compare(plainPassword, hash);
  return isMatch;
}

// Fungsi untuk hashing password
async function hashPassword(password) {
  try {
    const saltRounds = 10; // Jumlah putaran salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Hashing password failed");
  }
}

module.exports = { verifyPassword, hashPassword };
