const asynvHandler = require("express-async-handler");

const Goal = require("../models/GoalModel");

// @desc    Fetch all goals
// @route   GET /api/goals
// @access  Private
const getGoals = asynvHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const goals = await Goal.find({ user: req.user._id });
  res.json(goals);
});

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
const createGoal = asynvHandler(async (req, res) => {
  const { name, targetAmount, deadline, priority } = req.body;

  if (!name || !targetAmount || !deadline || !priority) {
    res.status(400);
    throw new Error("All fields are required");
  }

  let goalExists = await Goal.findOne({
    user: req.user._id,
    name,
  });

  if (goalExists) {
    res.status(400);
    throw new Error("Goal already exists");
  }

  const goal = await Goal.create({
    user: req.user._id,
    name,
    targetAmount,
    deadline,
    priority,
  });

  res.status(201).json(goal);
});

// @desc    Fetch a goal
// @route   GET /api/goals/:id
// @access  Private

const getGoal = asynvHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const goal = await Goal.find({ _id: req.params.id, user: req.user._id });

  if (goal) {
    res.json(goal);
  } else {
    res.status(404);
    throw new Error("Goal not found");
  }
});

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private

const updateGoal = asynvHandler(async (req, res) => {
  const { name, targetAmount, deadline, priority } = req.body;

  if (!name || !targetAmount || !deadline || !priority) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

  if (goal) {
    goal.name = name || goal.name;
    goal.targetAmount = targetAmount || goal.targetAmount;
    goal.deadline = deadline || goal.deadline;
    goal.priority = priority || goal.priority;
    goal.completed = req.body.completed || goal.completed;
    goal.updatedAt = Date.now();

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } else {
    res.status(404);
    throw new Error("Goal not found");
  }
});

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private

const deleteGoal = asynvHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

  if (goal) {
    await goal.remove();
    res.json({ message: "Goal removed" });
  } else {
    res.status(404);
    throw new Error("Goal not found");
  }
});

module.exports = { getGoals, getGoal, createGoal, updateGoal, deleteGoal };
