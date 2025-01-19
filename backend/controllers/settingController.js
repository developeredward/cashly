const asyncHandler = require("express-async-handler");
const Setting = require("../models/SettingModel");

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find({ user: req.user._id });
  res.json(settings);
});

// @desc   Create user settings
// @route  POST /api/settings
// @access Private
const createSettings = asyncHandler(async (req, res) => {
  const { theme, notificationsEnabled, preferredLanguage } = req.body;
  const settings = new Setting({
    user: req.user._id,
    theme,
    notificationsEnabled,
    preferredLanguage,
  });
  const createdSettings = await settings.save();
  res.status(201).json(createdSettings);
});

// @desc    Update user settings
// @route   PUT /api/settings
// @access  Private

const updateSettings = asyncHandler(async (req, res) => {
  const { theme, notificationsEnabled, preferredLanguage } = req.body;

  const settings = await Setting.findOne({ user: req.user._id });

  if (settings) {
    settings.theme = theme;
    settings.notificationsEnabled = notificationsEnabled;
    settings.preferredLanguage = preferredLanguage;
  } else {
    settings = new Setting({
      user: req.user._id,
      theme,
      notificationsEnabled,
      preferredLanguage,
    });
  }

  const updatedSettings = await settings.save();

  res.json(updatedSettings);
});

module.exports = { createSettings, getSettings, updateSettings };
