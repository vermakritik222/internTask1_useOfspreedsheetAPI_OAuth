const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/AuthenticationRouter");
const sheetRouter = require("./routes/sheetRouter");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./util/appError");

const app = express();

// JSON Parser
app.use(express.json());
// Cookie Parser
app.use(cookieParser());

// Routes
app.use("/", authRouter);
app.use("/spreadsheet", sheetRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
