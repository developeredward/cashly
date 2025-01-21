const router = require("express").Router();
const {
  getBudgets,
  getBudget,
  addBudget,
  deleteBudget,
  updateBudget,
} = require("../controllers/budgetController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getBudgets).post(protect, addBudget);
router
  .route("/:id")
  .get(protect, getBudget)
  .delete(protect, deleteBudget)
  .put(protect, updateBudget);

module.exports = router;
