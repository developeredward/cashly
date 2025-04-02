const Budget = require("./models/Budget");
const mongoose = require("mongoose");

// Create a new budget
exports.createBudget = async (req, res) => {
  const { user, name, amount, period, startDate, endDate } = req.body;

  try {
    const newBudget = new Budget({
      user,
      name,
      amount,
      period,
      startDate,
      endDate,
    });

    await newBudget.save();

    res.status(201).json({
      message: "Budget created successfully",
      budget: newBudget,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating budget", error: err.message });
  }
};

// Get all budgets for a user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }); // Assuming user is authenticated and user id is passed
    res.status(200).json({ budgets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching budgets", error: err.message });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  const { budgetId } = req.params;
  const { name, amount, spentAmount, period, startDate, endDate } = req.body;

  try {
    const budget = await Budget.findByIdAndUpdate(
      budgetId,
      { name, amount, spentAmount, period, startDate, endDate, updatedAt: Date.now() },
      { new: true } // Return the updated budget
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating budget", error: err.message });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  const { budgetId } = req.params;

  try {
    const budget = await Budget.findByIdAndDelete(budgetId);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting budget", error: err.message });
  }
};

// Get a specific budget by ID
exports.getBudgetById = async (req, res) => {
  const { budgetId } = req.params;

  try {
    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ budget });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching budget", error: err.message });
  }
};
