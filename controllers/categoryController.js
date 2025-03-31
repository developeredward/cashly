const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");

// @desc    Get all Categories
// @route   GET /api/categories
// @access  Private (User-specific or Admin)

const getCategories = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  let categories;

  categories = await Category.find();

  res.status(200).json(categories);
});

// @desc    Get single Category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  let category;

  category = await Category.findOne({
    _id: req.params.id,
  });

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

  const categoryExists = await Category.findOne({
    name: req.body.name,
    type: req.body.type,
  });

  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
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
  const category = await Category.findOne({
    _id: req.params.id,
  });

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
  const category = await Category.findOne({
    _id: req.params.id,
  });

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
