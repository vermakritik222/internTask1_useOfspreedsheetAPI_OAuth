const AppError = require("../util/appError");

const handelJsonWebTokenError = (err) =>
  new AppError("Invalid Token pleas login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorPro = (err, res) => {
  // OPERATIONAL ERROR sent res to clint
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // DEVELOPMENT ERROR
    console.log("ERROR !!!", err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "JsonWebTokenError")
      error = handelJsonWebTokenError(error);
    if (err.name === "TokenExpiredError") error = handelTokenExpiredError();
    const handelTokenExpiredError = () =>
      new AppError("your token has expired! pleas log in again.", 401);

    sendErrorPro(error, res);
  }
};
