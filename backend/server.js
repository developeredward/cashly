const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const connectDb = require("./config/db");

connectDb();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next(); // Pass control to the next middleware
});

app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/accounts", require("./routes/accountRoutes"));
app.use("/api/v1/categories", require("./routes/categoryRoutes"));
app.use("/api/v1/transactions", require("./routes/transactionRoutes"));
app.use("/api/v1/budgets", require("./routes/budgetRoutes"));
app.use("/api/v1/goals", require("./routes/goalRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
app.use("/api/v1/recurring-transactions", require("./routes/recurringRoutes"));
app.use("/api/v1/settings", require("./routes/settingRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
