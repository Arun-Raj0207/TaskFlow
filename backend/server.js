const protect = require("./middleware/authMiddleware");
const taskRoutes = require("./routes/taskRoutes");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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
const mongoUri = process.env.MONGO_URI || (process.env.NODE_ENV === "development" ? "mongodb://localhost:27017/task-manager" : undefined);

if (!mongoUri) {
  console.error("Missing MONGO_URI. Set the MONGO_URI environment variable before starting the backend.");
  process.exit(1);
}

console.log("Connecting to MongoDB at:", mongoUri);
mongoose.connect(mongoUri)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message || err);
    process.exit(1);
  });