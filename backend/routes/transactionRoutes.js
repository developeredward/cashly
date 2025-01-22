const router = require("express").Router();
const {
  getTransactions,
  getTransaction,
  addTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getTransactions).post(protect, addTransaction);
router
  .route("/:id")
  .get(protect, getTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
