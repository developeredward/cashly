const router = require("express").Router();

const {
  getGoals,
  getGoal,
  createGoal,
  deleteGoal,
  updateGoal,
} = require("../controllers/goalController");

router.route("/").get(getGoals).post(createGoal);
router.route("/:id").get(getGoal).delete(deleteGoal).put(updateGoal);

module.exports = router;
