const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://lifenft.vercel.app', 'https://lifenft-isvi2uic3-shadowsparks-projects.vercel.app/' ],
  credentials: true
}));
app.use("/auth", require("./routes/authRoutes"));

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to MySQL database:", err);
    return;
  }
  console.log("✅ Connected to Railway MySQL Database!");
  connection.release();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));