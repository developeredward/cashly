const router = require("express").Router();

const {
  getSettings,
  getSettingById,
  addSetting,
  deleteSetting,
  updateSetting,
} = require("../controllers/settingController");

router.route("/").get(getSettings).post(addSetting);
router
  .route("/:id")
  .get(getSettingById)
  .delete(deleteSetting)
  .put(updateSetting);

module.exports = router;
