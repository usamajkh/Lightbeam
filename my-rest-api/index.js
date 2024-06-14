const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const pool = require("./db");
const cors = require("cors");

app.use(express.json());
app.use(cors()); // Enable CORS

// Import routes
const userRouter = require("./routes/users");
const commentRouter = require("./routes/comments");
const canteenMenuRouter = require("./routes/canteenMenu");
const eventRouter = require("./routes/events");
const meetingRouter = require("./routes/meetings");

// Add this at the beginning of your index.js file, before other routes
app.get("/", (req, res) => {
  res.send("Welcome to the Lightbeam API!"); // Or any other response you want
});

// Mount routes correctly
app.use("/users", (req, res, next) => userRouter(req, res, next));
app.use("/comments", (req, res, next) => commentRouter(req, res, next));
app.use("/canteenMenu", (req, res, next) => canteenMenuRouter(req, res, next));
app.use("/events", (req, res, next) => eventRouter(req, res, next));
app.use("/meetings", (req, res, next) => meetingRouter(req, res, next));

// 404 Not Found handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  console.error(err.stack);
  res.status(statusCode).json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//Run this command in Terminal to run database server: node index.js
