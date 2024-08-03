// backend/server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5003;

// Enable CORS to allow requests from the frontend
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Ensure the uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Endpoint to handle photo uploads
app.post("/upload", upload.single("photo"), (req, res) => {
  res.json({ filePath: `uploads/${req.file.filename}` });
});

// Endpoint to retrieve photos
app.get("/photos", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve photos" });
    }
    res.json(files.map((file) => `uploads/${file}`));
  });
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
