const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Cash", "Bank", "Asset", "Credit Card", "Loan"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "MAD",
      enum: ["USD", "EUR", "GBP", "NGN", "MAD"],
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

module.exports = mongoose.model("Account", AccountSchema);
