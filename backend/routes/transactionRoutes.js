const router = require("express").Router();
const {
  getTransactions,
  getTransaction,
  addTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.route("/").get(getTransactions).post(addTransaction);
router.route("/:id").get(getTransaction).delete(deleteTransaction);

module.exports = router;
