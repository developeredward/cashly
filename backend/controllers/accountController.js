const asyncHandler = require("express-async-handler");
const Account = require("../models/AccountModel");

// @desc    Get all Accounts
// @route   GET /api/accounts
// @access  Public
const getAccounts = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const accounts = await Account.find({ user: req.user._id });

  res.status(200).json(accounts);
});

// @desc    Get single Account
// @route   GET /api/accounts/:id
// @access  Public
const getAccount = asyncHandler(async (req, res) => {
  const account = await Account.find({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  res.status(200).json(account);
});

// @desc    Create an Account
// @route   POST /api/accounts
// @access  Public

const addAccount = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.type) {
    res.status(400);
    throw new Error("Please fill all fields!");
  }

  const accountExists = await Account.findOne({
    name: req.body.name,
    user: req.user._id,
    type: req.body.type,
  });

  if (accountExists) {
    res.status(400);
    throw new Error("Account already exists");
  }

  const account = await Account.create({
    user: req.user._id,
    name: req.body.name,
    type: req.body.type,
    balance: req.body.balance,
    currency: req.body.currency,
  });

  res.status(201).json(account);
});

// @desc    Update an Account
// @route   PUT /api/accounts/:id
// @access  Public
const updateAccount = asyncHandler(async (req, res) => {
  const account = await Account.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  account.name = req.body.name || account.name;
  account.type = req.body.type || account.type;
  account.balance = req.body.balance || account.balance;
  account.currency = req.body.currency || account.currency;
  account.updatedAt = Date.now();

  await account.save();

  res.status(200).json(account);
});

// @desc    Delete an Account
const deleteAccount = asyncHandler(async (req, res) => {
  const account = await Account.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  await account.remove();

  res.status(200).json({ message: "Account removed" });
});

module.exports = {
  getAccounts,
  getAccount,
  addAccount,
  updateAccount,
  deleteAccount,
};
