const asyncHandler = require("express-async-handler");
const RecurringTransaction = require("../models/RecurringTransactionModel");

// @desc    Create a new recurring transaction
// @route   POST /api/recurring
// @access  Private
const createRecurringTransaction = asyncHandler(async (req, res) => {
  const { accountId, categoryId, type, amount, frequency, startDay, endDay } =
    req.body;

  const recurringTransaction = new RecurringTransaction({
    user: req.user._id,
    accountId,
    categoryId,
    type,
    amount,
    frequency,
    startDay,
    endDay,
  });

  const createdRecurringTransaction = await recurringTransaction.save();

  res.status(201).json(createdRecurringTransaction);
});

// @desc    Get all recurring transactions
// @route   GET /api/recurring
// @access  Private

const getRecurringTransactions = asyncHandler(async (req, res) => {
  const recurringTransactions = await RecurringTransaction.find({
    user: req.user._id,
  });

  res.json(recurringTransactions);
});

// @desc    Get a recurring transaction by ID
// @route   GET /api/recurring/:id
// @access  Private
const getRecurringTransactionById = asyncHandler(async (req, res) => {
  const recurringTransaction = await RecurringTransaction.findById(
    req.params.id
  );

  if (recurringTransaction) {
    res.json(recurringTransaction);
  } else {
    res.status(404);
    throw new Error("Recurring transaction not found");
  }
});

// @desc    Update a recurring transaction
// @route   PUT /api/recurring/:id
// @access  Private
const updateRecurringTransaction = asyncHandler(async (req, res) => {
  const { accountId, categoryId, type, amount, frequency, startDay, endDay } =
    req.body;

  const recurringTransaction = await RecurringTransaction.findById(
    req.params.id
  );

  if (recurringTransaction) {
    recurringTransaction.accountId =
      accountId || recurringTransaction.accountId;
    recurringTransaction.categoryId =
      categoryId || recurringTransaction.categoryId;
    recurringTransaction.type = type || recurringTransaction.type;
    recurringTransaction.amount = amount || recurringTransaction.amount;
    recurringTransaction.frequency =
      frequency || recurringTransaction.frequency;
    recurringTransaction.startDay = startDay || recurringTransaction.startDay;
    recurringTransaction.endDay = endDay || recurringTransaction.endDay;

    const updatedRecurringTransaction = await recurringTransaction.save();
    res.json(updatedRecurringTransaction);
  } else {
    res.status(404);
    throw new Error("Recurring transaction not found");
  }
});

// @desc    Delete a recurring transaction
// @route   DELETE /api/recurring/:id
// @access  Private

const deleteRecurringTransaction = asyncHandler(async (req, res) => {
  const recurringTransaction = await RecurringTransaction.findById(
    req.params.id
  );

  if (recurringTransaction) {
    await recurringTransaction.remove();
    res.json({ message: "Recurring transaction removed" });
  } else {
    res.status(404);
    throw new Error("Recurring transaction not found");
  }
});

module.exports = {
  createRecurringTransaction,
  getRecurringTransactions,
  getRecurringTransactionById,
  updateRecurringTransaction,
  deleteRecurringTransaction,
};
