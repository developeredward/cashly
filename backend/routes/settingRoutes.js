const router = require("express").Router();

const {
  getSettings,
  createSettings,
  updateSettings,
} = require("../controllers/settingController");

router.route("/").get(getSettings).post(createSettings);
router.route("/:id").put(updateSettings);

module.exports = router;
