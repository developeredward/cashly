const router = require("express").Router();

const {
  getNotifications,
  getNotificationById,
  createNotification,
  deleteNotification,
  updateNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getNotifications)
  .post(protect, createNotification);
router
  .route("/:id")
  .get(protect, getNotificationById)
  .delete(protect, deleteNotification)
  .put(protect, updateNotification);

module.exports = router;
