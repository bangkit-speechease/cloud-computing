const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const contentRoutes = require("./routes/contentRoutes.js");
const feedbackRoutes = require("./routes/feedbackRoutes.js");
const feedbacksRoutes = require("./routes/feedbacksRoutes.js");
const progressRoutes = require("./routes/progressRoutes.js");

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(
  authRoutes,
  userRoutes,
  contentRoutes,
  feedbackRoutes,
  feedbacksRoutes,
  progressRoutes
);

app.get("/", (req, res) => {
  res.send("Response success!");
});

app.listen(8080, () => {
  console.log(`Server running on port 8080...`);
});
