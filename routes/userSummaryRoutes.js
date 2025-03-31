const express = require("express");
const {
  getUserSummary,
  createUserSummary,
} = require("../controllers/userSummaryController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get user summary
router.get("/:id", protect, getUserSummary);

// Route to create user summary with admin protection
router.post("/", protect, createUserSummary);

module.exports = router;
