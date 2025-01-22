const router = require("express").Router();

const {
  getSettings,
  createSettings,
  updateSettings,
} = require("../controllers/settingController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getSettings).post(protect, createSettings);
router.route("/:id").put(protect, updateSettings);

module.exports = router;
