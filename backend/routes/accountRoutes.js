const router = require("express").Router();
const {
  getAccounts,
  getAccount,
  addAccount,
  deleteAccount,
  updateAccount,
} = require("../controllers/accountController");

router.route("/").get(getAccounts).post(addAccount);
router.route("/:id").get(getAccount).delete(deleteAccount).put(updateAccount);

module.exports = router;
