const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const connectDb = require("./config/db");

connectDb();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
