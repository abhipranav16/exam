const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

// Middleware to parse JSON bodies and handle CORS
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your React frontend URL
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// MySQL connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Manohar@01", // Replace with your actual MySQL root password
  database: "userDB",
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});

// Define the /register route
/*app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Check if email is from @iitg.ac.in domain
  if (!email.endsWith("@iitg.ac.in")) {
    return res
      .status(400)
      .json({ error: "Email must be an @iitg.ac.in address" });
  }

  // Check if user already exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Database error" });
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    }
  );
});*/

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Check if email is from @iitg.ac.in domain
  if (!email.endsWith("@iitg.ac.in")) {
    return res
      .status(400)
      .json({ error: "Email must be an @iitg.ac.in address" });
  }

  // Check if user already exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Database error during user lookup:", err);
        return res
          .status(500)
          .json({ error: "Database error during user lookup" });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Database error during user insertion:", err);
            return res
              .status(500)
              .json({ error: "Database error during user insertion" });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    }
  );
});

// Start the server on port 5000 or the port defined in the environment
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
