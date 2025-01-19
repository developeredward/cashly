const router = require("express").Router();

const {
  addUser,
  getUser,
  updateUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(addUser).get(protect, admin, getUsers);
router.route("/profile").get(protect, getUser).put(protect, updateUser);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUser)
  .put(protect, admin, updateUser);

module.exports = router;
