const router = require("express").Router();
const {
  getBudgets,
  getBudget,
  addBudget,
  deleteBudget,
  updateBudget,
} = require("../controllers/budgetController");

router.route("/").get(getBudgets).post(addBudget);
router.route("/:id").get(getBudget).delete(deleteBudget).put(updateBudget);

module.exports = router;
