const router = require("express").Router();

const {
  getGoals,
  getGoal,
  createGoal,
  deleteGoal,
  updateGoal,
} = require("../controllers/goalController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getGoals).post(protect, createGoal);
router
  .route("/:id")
  .get(protect, getGoal)
  .delete(protect, deleteGoal)
  .put(protect, updateGoal);

module.exports = router;
