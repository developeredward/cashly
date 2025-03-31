const UserSummary = require("../models/UserSummaryModel");

// Get User Summary
const getUserSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const summary = await UserSummary.findOne({ userId });

    if (!summary) {
      return res.status(404).json({ message: "User summary not found" });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Initialize User Summary (For New Users)
const createUserSummary = async (req, res) => {
  try {
    const { userId } = req.body;

    const existingSummary = await UserSummary.findOne({ userId });

    if (existingSummary) {
      return res.status(400).json({ message: "User summary already exists" });
    }

    const newSummary = new UserSummary({ userId });
    await newSummary.save();

    res.status(201).json(newSummary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUserSummary, createUserSummary };
