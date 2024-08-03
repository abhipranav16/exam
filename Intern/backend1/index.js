// Load environment variables from .env file
/*require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

// Print loaded environment variables for debugging (mask sensitive data)
console.log("Loaded environment variables:", {
  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "******" : undefined,
});

// Validate environment variables
if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
  console.error("Missing email credentials. Please check your .env file.");
  process.exit(1); // Exit the application
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

const otpStore = {};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/send-otp", (req, res) => {
  console.log("Received POST request to /send-otp");
  console.log("Request body:", req.body);

  const { email } = req.body;
  if (!email) {
    console.error("No email provided in request");
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOTP();
  otpStore[email] = otp;

  console.log(`Generated OTP for ${email}: ${otp}`);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ error: "Failed to send OTP. Please try again." });
    }
    console.log("OTP sent:", info.response);
    res.json({ message: `OTP has been sent to ${email}` });
  });
});

app.post("/verify-otp", (req, res) => {
  console.log("Received POST request to /verify-otp");
  console.log("Request body:", req.body);

  const { email, otp } = req.body;
  if (!email || !otp) {
    console.error("Email or OTP missing in request");
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const storedOtp = otpStore[email];
  if (storedOtp === otp) {
    console.log(`OTP verification successful for ${email}`);
    delete otpStore[email];
    return res.json({ message: "OTP is valid" });
  } else {
    console.error(`OTP verification failed for ${email}`);
    return res.status(400).json({ error: "Invalid OTP" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/

require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

// Print loaded environment variables for debugging (mask sensitive data)
console.log("Loaded environment variables:", {
  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "******" : undefined,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
});

// Validate environment variables
if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
  console.error("Missing email credentials. Please check your .env file.");
  process.exit(1); // Exit the application
}

const app = express();
const PORT = process.env.PORT || 5000;

// Setup CORS to allow requests from the frontend origin
const allowedOrigins = [process.env.FRONTEND_ORIGIN];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(bodyParser.json());
app.use(morgan("dev"));

const otpStore = {};

// Generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/send-otp", (req, res) => {
  console.log("Received POST request to /send-otp");
  console.log("Request body:", req.body);

  const { email } = req.body;
  if (!email) {
    console.error("No email provided in request");
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOTP();
  otpStore[email] = otp;

  console.log(`Generated OTP for ${email}: ${otp}`);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ error: "Failed to send OTP. Please try again." });
    }
    console.log("OTP sent:", info.response);
    res.json({ message: `OTP has been sent to ${email}` });
  });
});

app.post("/verify-otp", (req, res) => {
  console.log("Received POST request to /verify-otp");
  console.log("Request body:", req.body);

  const { email, otp } = req.body;
  if (!email || !otp) {
    console.error("Email or OTP missing in request");
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const storedOtp = otpStore[email];
  if (storedOtp === otp) {
    console.log(`OTP verification successful for ${email}`);
    delete otpStore[email];
    return res.json({ message: "OTP is valid" });
  } else {
    console.error(`OTP verification failed for ${email}`);
    return res.status(400).json({ error: "Invalid OTP" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
