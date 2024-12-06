const jwt = require("jsonwebtoken"); // Import JWT

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Mengambil token dari header

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    // Verifikasi token dengan secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Simpan informasi pengguna di request
    next(); // Lanjutkan ke route berikutnya
  } catch (error) {
    console.error("Error saat verifikasi token:", error.message);
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
