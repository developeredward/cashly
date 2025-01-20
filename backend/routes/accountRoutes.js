const router = require("express").Router();
const {
  getAccounts,
  getAccount,
  addAccount,
  deleteAccount,
  updateAccount,
} = require("../controllers/accountController");

const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAccounts).post(protect, addAccount);
router
  .route("/:id")
  .get(protect, getAccount)
  .delete(protect, deleteAccount)
  .put(protect, updateAccount);

module.exports = router;
