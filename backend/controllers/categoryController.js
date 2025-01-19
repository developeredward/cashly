const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");

// @desc    Get all Categories
// @route   GET /api/categories
// @access  Public

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json(categories);
});

// @desc    Get single Category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json(category);
});

// @desc    Create a Category
// @route   POST /api/categories
// @access  Public

const addCategory = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.type) {
    res.status(400);
    throw new Error("Please fill all fields!");
  }
  const category = await Category.create({
    user: req.user._id,
    name: req.body.name,
    type: req.body.type,
    icon: req.body.icon,
  });

  res.status(201).json(category);
});

// @desc    Update a Category
// @route   PUT /api/categories/:id
// @access  Public

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = req.body.name || category.name;
  category.type = req.body.type || category.type;
  category.icon = req.body.icon || category.icon;

  await category.save();
  res.status(200).json(category);
});

// @desc    Delete a Category
// @route   DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.remove();
  res.status(200).json({ message: "Category removed" });
});

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
