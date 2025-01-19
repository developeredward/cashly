const router = require("express").Router();

const {
  getGoals,
  getGoalById,
  addGoal,
  deleteGoal,
  updateGoal,
} = require("../controllers/goalController");

router.route("/").get(getGoals).post(addGoal);
router.route("/:id").get(getGoalById).delete(deleteGoal).put(updateGoal);

module.exports = router;
