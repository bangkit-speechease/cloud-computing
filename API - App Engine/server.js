const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/auth/authRoutes.js");
const userRoutes = require("./routes/userProfile/userRoutes.js");
const contentRoutes = require("./routes/content/contentRoutes.js");
const feedbackRoutes = require("./routes/feedback/feedbackRoutes.js");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(authRoutes, userRoutes, contentRoutes, feedbackRoutes);

app.get("/", (req, res) => {
  res.send("Response success!");
});

app.listen(8080, () => {
  console.log(`Server running on port 8080...`);
});
