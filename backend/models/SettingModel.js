const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: {
      type: String,
      default: "light",
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    preferredLanguage: {
      type: String,
      default: "en",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", SettingSchema);
