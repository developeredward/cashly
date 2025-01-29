const express = require("express");
const http = require("http");
const { Server } = require("ws");
const { errorHandler } = require("./middleware/errorHandler");
const connectDb = require("./config/db");
const { watchUserSummary } = require("./utils/userSummaryWatcher");

connectDb();

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// API Routes
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/user-summary", require("./routes/userSummaryRoutes"));
app.use("/api/v1/accounts", require("./routes/accountRoutes"));
app.use("/api/v1/categories", require("./routes/categoryRoutes"));
app.use("/api/v1/transactions", require("./routes/transactionRoutes"));
app.use("/api/v1/budgets", require("./routes/budgetRoutes"));
app.use("/api/v1/goals", require("./routes/goalRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
app.use("/api/v1/recurring-transactions", require("./routes/recurringRoutes"));
app.use("/api/v1/settings", require("./routes/settingRoutes"));

app.use(errorHandler);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to Cashly API");
});

// WebSocket Connection
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.send(JSON.stringify({ message: "Connected to WebSocket server" }));

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Start Watching for User Summary Updates
watchUserSummary(wss);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
