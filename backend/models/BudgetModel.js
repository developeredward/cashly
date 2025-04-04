const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      // Add name to the budget
      type: String,
      required: [true, "Budget name is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    spentAmount: {
      // Track the amount spent within the budget
      type: Number,
      default: 0,
    },
    period: {
      type: String,
      required: [true, "Period is required"],
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
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

module.exports = mongoose.model("Budget", BudgetSchema);
