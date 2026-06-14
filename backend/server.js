const fs = require("fs");
const path = require("path");
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

const initializeDatabase = async () => {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  console.log("Initializing database schema...");
  await pool.query(schemaSql);
  console.log("Database schema initialized successfully.");
};

if (!dbUrl) {
  console.warn("DATABASE_URL not set. Starting server without connecting to PostgreSQL.");
  startServer();
} else {
  console.log("Connecting to PostgreSQL...");
  pool.connect(async (err, client, release) => {
    if (err) {
      console.error("PostgreSQL connection failed:", err.message || err);
      console.warn("Continuing to run the server without a database connection. Some features may fail.");
      startServer();
    } else {
      console.log("PostgreSQL Connected");
      release();
      try {
        await initializeDatabase();
        startServer();
      } catch (initError) {
        console.error("Database initialization failed:", initError.message || initError);
        process.exit(1);
      }
    }
  });

  pool.on("error", (err) => {
    console.error("PostgreSQL connection error:", err.message || err);
  });
}