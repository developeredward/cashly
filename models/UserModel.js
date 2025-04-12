const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Transaction = require("./TransactionModel");
const Account = require("./AccountModel");
const Budget = require("./BudgetModel");
const Goal = require("./GoalModel");
const Settings = require("./SettingModel");
const UserSummary = require("./UserSummaryModel");
const RecurringTransaction = require("./RecurringTransactionModel");
const Notification = require("./NotificationModel");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
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
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Pre-save middleware to hash the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;
    console.log(
      `Cascade deleting transactions and accounts for user: ${userId}`
    );

    await Transaction.deleteMany({ userId });
    await Account.deleteMany({ userId });
    await Budget.deleteMany({ userId });
    await Goal.deleteMany({ userId });
    await Settings.deleteMany({ userId });
    await UserSummary.deleteMany({ userId });
    await RecurringTransaction.deleteMany({ userId });
    await Notification.deleteMany({ userId });
    console.log("Cascade delete completed.");
    

    console.log("Related transactions and accounts deleted.");
    next();
  }
);

module.exports = mongoose.model("User", UserSchema);
