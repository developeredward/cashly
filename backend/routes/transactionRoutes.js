const router = require("express").Router();
const {
  getTransactions,
  getTransactionById,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

router.route("/").get(getTransactions).post(addTransaction);
router
  .route("/:id")
  .get(getTransactionById)
  .delete(deleteTransaction)
  .put(updateTransaction);

module.exports = router;
