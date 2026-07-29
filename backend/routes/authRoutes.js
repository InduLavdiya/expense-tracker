const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  getProfile,
  changePassword,
  saveMonthlyLimit,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// ===============================
// Authentication Routes
// ===============================

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);


// Get Profile
router.get("/profile", protect, getProfile);
// Update Profile
router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

router.put("/monthly-limit", protect, saveMonthlyLimit);

module.exports = router;

