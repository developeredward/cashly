const router = require("express").Router();
const {
  getCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

router.route("/").get(getCategories).post(addCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .delete(deleteCategory)
  .put(updateCategory);

module.exports = router;
