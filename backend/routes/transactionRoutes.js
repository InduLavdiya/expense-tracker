const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
  searchTransactions,
  getTransactionsByCategory,
  getTransactionsByDate,
  getMonthlyStats,
  getRecentTransactions,
  getMonthlyExpenseChart,
   getFinancialOverview,
   getCategoryReport,
} = require("../controllers/transactionController");

// ===============================
// Create Transaction
// ===============================
router.post("/", protect, addTransaction);

// ===============================
// Dashboard Summary
// ===============================
router.get("/summary", protect, getSummary);

// ===============================
// Search Transactions
// ===============================
router.get("/search", protect, searchTransactions);

// ===============================
// Category Filter
// ===============================
router.get("/category/:category", protect, getTransactionsByCategory);

// ===============================
// Date Filter
// ===============================
router.get("/date", protect, getTransactionsByDate);

// ===============================
// Monthly Statistics
// ===============================
router.get("/monthly-stats", protect, getMonthlyStats);

// ===============================
// Monthly Expense Chart
// ===============================
router.get("/monthly-chart", protect, getMonthlyExpenseChart);

router.get("/financial-overview", protect, getFinancialOverview);


router.get("/category-report", protect, getCategoryReport);
// ===============================
// Recent Transactions
// ===============================
router.get("/recent", protect, getRecentTransactions);

// ===============================
// Get All Transactions
// ===============================
router.get("/", protect, getTransactions);

// ===============================
// Update Transaction
// ===============================
router.put("/:id", protect, updateTransaction);

// ===============================
// Delete Transaction
// ===============================
router.delete("/:id", protect, deleteTransaction);

module.exports = router;