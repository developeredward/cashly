const mongoose = require("mongoose");

const UserSummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalExpenses: { type: Number, default: 0 },
    totalIncome: { type: Number, default: 0 },
    monthlyBudget: { type: Number, default: 0 },
    goalProgress: { type: Number, default: 0 }, // Percentage of goals completed
    unreadNotifications: { type: Number, default: 0 },
    recentTransactions: [
      {
        amount: { type: Number, required: true },
        category: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSummary", UserSummarySchema);
