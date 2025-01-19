const asyncHandler = require("express-async-handler");
const Transaction = require("../models/TransactionModel");

// @desc    Fetch all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    userId: req.user._id,
  }).populate("category", "name");
  res.json(transactions);
});

// @desc    Fetch a single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate(
    "category",
    "name"
  );

  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404);
    throw new Error("Transaction not found");
  }
});

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
  const { accountId, amount, type, category, date, description } = req.body;

  const transaction = new Transaction({
    userId: req.user._id,
    accountId,
    amount,
    type,
    category,
    date,
    description,
  });

  const createdTransaction = await transaction.save();
  res.status(201).json(createdTransaction);
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (transaction) {
    await transaction.remove();
    res.json({ message: "Transaction removed" });
  } else {
    res.status(404);
    throw new Error("Transaction not found");
  }
});

module.exports = {
  getTransactions,
  getTransactionById,
  addTransaction,
  deleteTransaction,
};
