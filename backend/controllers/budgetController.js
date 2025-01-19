const asyncHandler = require("express-async-handler");

const Budget = require("../models/BudgetModel");

// @desc    Get all Budgets
// @route   GET /api/budgets
// @access  Public
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find();

  res.status(200).json(budgets);
});

// @desc    Get single Budget
// @route   GET /api/budgets/:id
// @access  Public
const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }

  res.status(200).json(budget);
});

// @desc    Create a Budget
// @route   POST /api/budgets
// @access  Public

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
// @access  Public

const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

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
// @access  Public

const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

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
