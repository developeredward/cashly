const router = require("express").Router();

const {
  getNotifications,
  getNotificationById,
  addNotification,
  deleteNotification,
  updateNotification,
} = require("../controllers/notificationController");

router.route("/").get(getNotifications).post(addNotification);
router
  .route("/:id")
  .get(getNotificationById)
  .delete(deleteNotification)
  .put(updateNotification);

module.exports = router;
