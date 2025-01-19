const router = require("express").Router();
const {
  getCategories,
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

router.route("/").get(getCategories).post(addCategory);
router
  .route("/:id")
  .get(getCategory)
  .delete(deleteCategory)
  .put(updateCategory);

module.exports = router;
