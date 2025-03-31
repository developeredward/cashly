const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: ["Low", "Medium", "High"],
    },
    completed: {
      type: Boolean,
      default: false,
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

  { timestamps: true }
);
module.exports = mongoose.model("Goal", GoalSchema);
