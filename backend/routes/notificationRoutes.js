const router = require("express").Router();

const {
  getNotifications,
  getNotificationById,
  createNotification,
  deleteNotification,
  updateNotification,
} = require("../controllers/notificationController");

const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getNotifications)
  .post(protect, admin, createNotification);
router
  .route("/:id")
  .get(protect, getNotificationById)
  .delete(protect, admin, deleteNotification)
  .put(protect, admin, updateNotification);

module.exports = router;
