const asyncHandler = require("express-async-handler");
const Budget = require("../models/BudgetModel");
const mongoose = require("mongoose");

// Create a new budget
const createBudget = async (req, res) => {
  const { name, amount, period, startDate, endDate } = req.body;

  try {
    const newBudget = new Budget({
      user: req.user._id, // Get the user ID from the token
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
    res
      .status(500)
      .json({ message: "Error creating budget", error: err.message });
  }
};

// Get all budgets for a user
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }); // Assuming user is authenticated and user id is passed
    res.status(200).json({ budgets });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching budgets", error: err.message });
  }
};

// Update a budget
const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { name, amount, spentAmount, period, startDate, endDate } = req.body;

  try {
    const budget = await Budget.findByIdAndUpdate(
      id,
      {
        name,
        amount,
        spentAmount,
        period,
        startDate,
        endDate,
        updatedAt: Date.now(),
      },
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
    res
      .status(500)
      .json({ message: "Error updating budget", error: err.message });
  }
};

// Delete a budget
const deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findByIdAndDelete(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error deleting budget", error: err.message });
  }
};

// Get a specific budget by ID
const getBudgetById = async (req, res) => {
  const { id } = req.params;

  // Check if the provided id is a valid ObjectId
  console.log("Budget ID:", id);
  try {
    // Fetch the budget by ID and also ensure it belongs to the logged-in user
    const budget = await Budget.findOne({
      _id: id,
      user: req.user._id, // Check that the budget belongs to the authenticated user
    });

    if (!budget) {
      return res
        .status(404)
        .json({ message: "Budget not found or doesn't belong to the user" });
    }

    res.status(200).json({ budget });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching budget", error: err.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  getBudgetById,
};
