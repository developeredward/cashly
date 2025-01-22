const asyncHandler = require("express-async-handler");
const Setting = require("../models/SettingModel");

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
const getSettings = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const settings = await Setting.find({ user: req.user._id });
  res.json(settings);
});

// @desc   Create user settings
// @route  POST /api/settings
// @access Private
const createSettings = asyncHandler(async (req, res) => {
  const { theme, notificationsEnabled, preferredLanguage } = req.body;

  let settingsExists = await Setting.findOne({ user: req.user._id });

  if (settingsExists) {
    res.status(400);
    throw new Error("Settings already exists");
  }
  const settings = await Setting.create({
    user: req.user._id,
    theme,
    notificationsEnabled,
    preferredLanguage,
  });
  res.status(201).json(createdSettings);
});

// @desc    Update user settings
// @route   PUT /api/settings
// @access  Private

const updateSettings = asyncHandler(async (req, res) => {
  const { theme, notificationsEnabled, preferredLanguage } = req.body;

  const settings = await Setting.findOne({ user: req.user._id });

  if (settings) {
    settings.theme = theme || settings.theme;
    settings.notificationsEnabled =
      notificationsEnabled || settings.notificationsEnabled;
    settings.preferredLanguage =
      preferredLanguage || settings.preferredLanguage;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } else {
    res.status(404);
    throw new Error("Settings not found");
  }
});

module.exports = { createSettings, getSettings, updateSettings };
