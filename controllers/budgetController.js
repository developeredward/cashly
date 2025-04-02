const asyncHandler = require("express-async-handler");

const Budget = require("../models/BudgetModel");

// @desc    Get all Budgets
// @route   GET /api/budgets
// @access  Private (based on the token)
const getBudgets = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Fetch budgets based on the logged-in user (using req.user._id from token)
  const budgets = await Budget.find({ user: req.user._id });

  res.status(200).json(budgets);
});

// @desc    Get single Budget
// @route   GET /api/budgets/:id
// @access  Private (based on the token)
const getBudget = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Fetch a specific budget by id (based on token authorization)
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }

  res.status(200).json(budget);
});

// @desc    Create a Budget
// @route   POST /api/budgets
// @access  Private (based on the token)
const addBudget = asyncHandler(async (req, res) => {
  if (
    !req.body.amount ||
    !req.body.period ||
    !req.body.startDate ||
    !req.body.endDate
  ) {
    res.status(400);
    throw new Error("Please fill all fields!");
  }

  // Ensure the logged-in user can create a budget for their own account
  let budgetExists = await Budget.findOne({
    user: req.user._id,
    category: req.body.category,
    period: req.body.period,
  });

  if (budgetExists) {
    res.status(400);
    throw new Error("Budget already exists for this category and period");
  }

  // Create a new budget for the logged-in user
  const budget = await Budget.create({
    user: req.user._id,
    category: req.body.category,
    amount: req.body.amount,
    period: req.body.period,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  res.status(201).json(budget);
});

// @desc    Update a Budget
// @route   PUT /api/budgets/:id
// @access  Private (based on the token)
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }

  budget.amount = req.body.amount || budget.amount;
  budget.period = req.body.period || budget.period;
  budget.startDate = req.body.startDate || budget.startDate;
  budget.endDate = req.body.endDate || budget.endDate;
  budget.updatedAt = Date.now();

  await budget.save();
  res.status(200).json(budget);
});

// @desc    Delete a Budget
// @route   DELETE /api/budgets/:id
// @access  Private (based on the token)
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }

  await budget.remove();
  res.status(200).json({ message: "Budget removed" });
});

module.exports = {
  getBudgets,
  getBudget,
  addBudget,
  updateBudget,
  deleteBudget,
};
