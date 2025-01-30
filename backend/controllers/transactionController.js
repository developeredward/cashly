const asyncHandler = require("express-async-handler");
const Transaction = require("../models/TransactionModel");

// @desc    Fetch all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const transactions = await Transaction.find({
    userId: req.user._id,
  }).populate("category", "name");
  res.json(transactions);
});

// @desc    Fetch a single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const transaction = await Transaction.find({
    _id: req.params.id,
    userId: req.user._id,
  }).populate("category", "name");

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

  if (!accountId || !amount || !type || !category) {
    res.status(400);
    throw new Error("All fields are required");
  }

  let transactionExists = await Transaction.findOne({
    userId: req.user._id,
    accountId,
    amount,
    type,
    category,
    date,
  });

  if (transactionExists) {
    res.status(400);
    throw new Error("Transaction already exists");
  }

  const transaction = await Transaction.create({
    userId: req.user._id,
    accountId,
    amount,
    type,
    category,
    date,
    description,
  });

  res.status(201).json(transaction);
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (transaction) {
    await transaction.deleteOne({ _id: req.params.id });
    res.json({ message: "Transaction removed" });
  } else {
    res.status(404);
    throw new Error("Transaction not found");
  }
});

module.exports = {
  getTransactions,
  getTransaction,
  addTransaction,
  deleteTransaction,
};
