const mongoose = require("mongoose");

const RecurringTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Income", "Expense"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
    },
    startDay: {
      type: Date,
      required: [true, "Start day is required"],
    },
    endDay: {
      type: Date,
      required: [true, "End day is required"],
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

module.exports = mongoose.model(
  "RecurringTransaction",
  RecurringTransactionSchema
);
