const router = require("express").Router();

const {
  getRecurringTransactions,
  getRecurringTransactionById,
  createRecurringTransaction,
  deleteRecurringTransaction,
  updateRecurringTransaction,
} = require("../controllers/recurringController");

const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getRecurringTransactions)
  .post(protect, createRecurringTransaction);
router
  .route("/:id")
  .get(protect, getRecurringTransactionById)
  .delete(protect, deleteRecurringTransaction)
  .put(protect, updateRecurringTransaction);

module.exports = router;
