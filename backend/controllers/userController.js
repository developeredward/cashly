const asyncHandler = require("express-async-handler");

const User = require("../models/UserModel");

// @desc    Get all Users
// @route   GET /api/Users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const Users = await User.find();

  res.status(200).json(Users);
});

// @desc    Get single User
// @route   GET /api/Users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  const User = await User.findById(req.params.id);

  if (!User) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(User);
});

// @desc    Create a User
// @route   POST /api/Users
// @access  Public

const addUser = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Please fill all fields!");
  }
  const User = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    currency: req.body.currency,
  });

  res.status(201).json(User);
});

// @desc    Update a User
// @route   PUT /api/Users/:id
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  const User = await User.findById(req.params.id);

  if (!User) {
    res.status(404);
    throw new Error("User not found");
  }

  User.name = req.body.name || User.name;
  User.email = req.body.email || User.email;
  User.currency = req.body.currency || User.currency;
  User.password = req.body.password || User.password;
  User.updatedAt = Date.now();

  const updatedUser = await User.save();

  res.status(200).json(updatedUser);
});

// @desc    Delete a User
// @route   DELETE /api/Users/:id
// @access  Public

const deleteUser = asyncHandler(async (req, res) => {
  const User = await User.findById(req.params.id);

  if (!User) {
    res.status(404);
    throw new Error("User not found");
  }
  await User.deleteOne();

  res.status(200).json({ message: "User removed" });
});

module.exports = { getUsers, getUser, addUser, updateUser, deleteUser };
