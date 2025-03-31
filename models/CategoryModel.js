const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Income", "Expense"],
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
