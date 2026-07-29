const Transaction = require("../models/Transaction");

// Add Transaction
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    // Validation
if (!title || !amount || !type || !category) {
  return res.status(400).json({
    success: false,
    message: "Please fill all required fields",
  });
}

if (amount <= 0) {
  return res.status(400).json({
    success: false,
    message: "Amount must be greater than zero",
  });
}

if (!["Income", "Expense"].includes(type)) {
  return res.status(400).json({
    success: false,
    message: "Type must be either Income or Expense",
  });
}

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      date,
    });

    res.status(201).json({
    success: true,
    message: "Transaction Added Successfully",
    transaction,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ date: -1 });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction Not Found",
      });
    }

    res.status(200).json({
      message: "Transaction Updated Successfully",
      transaction,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction Not Found",
      });
    }

    res.status(200).json({
      message: "Transaction Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Dashboard Summary
const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Search Transactions
const searchTransactions = async (req, res) => {
  try {
    const { title } = req.query;

    const transactions = await Transaction.find({
      user: req.user.id,
      title: { $regex: title, $options: "i" },
    }).sort({ date: -1 });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Filter Transactions by Category
const getTransactionsByCategory = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
      category: req.params.category,
    }).sort({ date: -1 });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Filter Transactions by Date
const getTransactionsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;

    const transactions = await Transaction.find({
      user: req.user.id,
      date: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    }).sort({ date: -1 });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Monthly Statistics
const getMonthlyStats = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const transactions = await Transaction.find({
      user: req.user.id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    res.status(200).json({
      month,
      year,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactions: transactions.length,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Recent Transactions
const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ================================
// Monthly Expense Chart
// ================================

const getMonthlyExpenseChart = async (req, res) => {

  try {

    const transactions = await Transaction.find({
      user: req.user.id,
      type: "Expense",
    });

    const monthlyExpenses = Array(12).fill(0);

    transactions.forEach((transaction) => {

      const month = new Date(transaction.date).getMonth();

      monthlyExpenses[month] += transaction.amount;

    });

    res.status(200).json(monthlyExpenses);

  }

  catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// ================================
// Financial Overview Chart
// ================================

const getFinancialOverview = async (req, res) => {

  try {

    const transactions = await Transaction.find({
      user: req.user.id,
    });

    const income = Array(12).fill(0);
    const expense = Array(12).fill(0);

    transactions.forEach((transaction) => {

      const month = new Date(transaction.date).getMonth();

      if (transaction.type === "Income") {
        income[month] += transaction.amount;
      } else {
        expense[month] += transaction.amount;
      }

    });

    res.status(200).json({
      income,
      expense,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================================
// Expense By Category Report
// ==========================================

const getCategoryReport = async (req, res) => {

    try {

        const transactions = await Transaction.find({

            user: req.user.id,

            type: "Expense"

        });

        const categoryData = {};

        transactions.forEach((transaction) => {

            if (categoryData[transaction.category]) {

                categoryData[transaction.category] += transaction.amount;

            } else {

                categoryData[transaction.category] = transaction.amount;

            }

        });

        res.status(200).json(categoryData);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


module.exports = {
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
};