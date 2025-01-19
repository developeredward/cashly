const asyncHandler = require("express-async-handler");

const Notification = require("../models/NotificationModel");

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(notifications);
});

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private

const createNotification = asyncHandler(async (req, res) => {
  const { type, message } = req.body;

  if (!type || !message) {
    res.status(400);
    throw new Error("Type and message are required");
  }

  const notification = await Notification.create({
    user: req.user._id,
    type,
    message,
  });

  res.status(201).json(notification);
});

// @desc    Get a notification
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.json(notification);
});

// @desc    Update a notification
// @route   PUT /api/notifications/:id
// @access  Private
const updateNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  const { type, message, isRead } = req.body;

  notification.type = type || notification.type;
  notification.message = message || notification.message;
  notification.isRead = isRead || notification.isRead;

  const updatedNotification = await notification.save();

  res.json(updatedNotification);
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  await notification.remove();

  res.json({ message: "Notification removed" });
});

module.exports = {
  getNotifications,
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
