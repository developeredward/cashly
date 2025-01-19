const router = require("express").Router();

const {
  getNotifications,
  getNotificationById,
  createNotification,
  deleteNotification,
  updateNotification,
} = require("../controllers/notificationController");

router.route("/").get(getNotifications).post(createNotification);
router
  .route("/:id")
  .get(getNotificationById)
  .delete(deleteNotification)
  .put(updateNotification);

module.exports = router;
