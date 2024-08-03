// Import required modules
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create a connection pool to the MySQL database
const db = mysql
  .createPool({
    host: "localhost", // Replace with your DB host
    user: "root", // Replace with your DB user
    password: "Manohar@01", // Replace with your DB password
    database: "userDB", // Replace with your DB name
  })
  .promise();

// Initialize the Express app
const app = express();

// Use middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(bodyParser.json()); // Parse JSON request bodies

// Hardcoded secret key for JWT (not recommended for production)
const JWT_SECRET = "Manohar@123456789"; // Use a strong, unique key

// Define the User model functions
const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

// Define the User controller functions for login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token valid for 1 hour
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Respond with the token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to authenticate user based on token
const authenticate = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token and extract user id
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Define the routes for login and protected profile
app.post("/api/users/login", login);

// Protected route example
app.get("/api/users/profile", authenticate, async (req, res) => {
  try {
    // Fetch the user details using the user id from the token
    const user = await findUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
