var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

var app = express();

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("an error occured", err);
  });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1/auth", authRouter);
app.use("/v1/admin", adminRouter);
app.use("/v1/users", usersRouter);

app.get("/", (req, res) => {
  res.status(200);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).send(res.locals.error);
});

module.exports = app;
