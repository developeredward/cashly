const router = require("express").Router();

const {
  getRecurrings,
  getRecurringById,
  addRecurring,
  deleteRecurring,
  updateRecurring,
} = require("../controllers/recurringController");

router.route("/").get(getRecurrings).post(addRecurring);
router
  .route("/:id")
  .get(getRecurringById)
  .delete(deleteRecurring)
  .put(updateRecurring);

module.exports = router;
