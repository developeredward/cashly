const router = require("express").Router();
const {
  getCategories,
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, getCategories).post(protect, addCategory);
router
  .route("/:id")
  .get(protect, getCategory)
  .delete(protect, deleteCategory)
  .put(protect, updateCategory);

module.exports = router;
