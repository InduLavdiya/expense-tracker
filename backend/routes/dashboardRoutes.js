const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { getSummary } = require("../controllers/transactionController");

// Dashboard Summary
router.get("/", protect, getSummary);

module.exports = router;