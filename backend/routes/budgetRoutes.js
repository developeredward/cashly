const router = require("express").Router();
const {
  getBudgets,
  getBudgetById,
  addBudget,
  deleteBudget,
  updateBudget,
} = require("../controllers/budgetController");

router.route("/").get(getBudgets).post(addBudget);
router.route("/:id").get(getBudgetById).delete(deleteBudget).put(updateBudget);

module.exports = router;
