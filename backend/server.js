const protect = require("./middleware/authMiddleware");
const taskRoutes = require("./routes/taskRoutes");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoots");
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("YOOO IM ALIVE");
});

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;
const dbUrl = process.env.DATABASE_URL;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (!dbUrl) {
  console.warn("DATABASE_URL not set. Starting server without connecting to PostgreSQL.");
  startServer();
} else {
  console.log("Connecting to PostgreSQL...");
  pool.connect((err, client, release) => {
    if (err) {
      console.error("PostgreSQL connection failed:", err.message || err);
      console.warn("Continuing to run the server without a database connection. Some features may fail.");
      startServer();
    } else {
      console.log("PostgreSQL Connected");
      release();
      startServer();
    }
  });

  pool.on("error", (err) => {
    console.error("PostgreSQL connection error:", err.message || err);
  });
}