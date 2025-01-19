const router = require("express").Router();

const {
  getRecurringTransactions,
  getRecurringTransactionById,
  createRecurringTransaction,
  deleteRecurringTransaction,
  updateRecurringTransaction,
} = require("../controllers/recurringController");

router
  .route("/")
  .get(getRecurringTransactions)
  .post(createRecurringTransaction);
router
  .route("/:id")
  .get(getRecurringTransactionById)
  .delete(deleteRecurringTransaction)
  .put(updateRecurringTransaction);

module.exports = router;
