const express = require('express')
const authRoutes = require('./routes/auth/authRoutes.js')
// const userRoutes = require('./routes/userProfile/userRoutes.js')
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use(authRoutes);
// app.use('/userProfile', userRoutes);

app.get("/", (req, res) => {
    res.send("Response success!")
})

// port
// const port = process.env.PORT || 8080;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}...`);
// });

app.listen(8080, () => {
    console.log(`Server running on port 8080...`);
  });
