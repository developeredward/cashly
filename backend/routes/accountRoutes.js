const router = require("express").Router();
const {
  getAccounts,
  getAccountById,
  addAccount,
  deleteAccount,
  updateAccount,
} = require("../controllers/accountController");

router.route("/").get(getAccounts).post(addAccount);
router
  .route("/:id")
  .get(getAccountById)
  .delete(deleteAccount)
  .put(updateAccount);

module.exports = router;
