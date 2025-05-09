const router = require("express").Router();
const {
  getBudgets,
  getBudgetById,  // Renamed to match controller
  createBudget,   // Renamed to match controller
  deleteBudget,
  updateBudget,
} = require("../controllers/budgetController");

const { protect } = require("../middleware/authMiddleware");

// Routes to get all budgets and create a new budget - both protected by the token
router.route("/")
  .get(protect, getBudgets)   // Use protect to ensure the user is authenticated
  .post(protect, createBudget);  // Use protect to ensure the user is authenticated

// Routes for individual budget operations (based on budget ID)
router
  .route("/:id")
  .get(protect, getBudgetById)      // Fetch a specific budget by its ID (protected)
  .put(protect, updateBudget)   // Update a specific budget (protected)
  .delete(protect, deleteBudget); // Delete a specific budget (protected)

module.exports = router;
