// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    // default values
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong!",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  if (err.code && err.code === 11000) {
    // 11000 -> duplicate error
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Entered ${Object.keys(
      err.keyValue
    )} has already been taken. Please try again with a different value.`;
  }
  if (err.name && err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `${Object.values(err.errors)
      .map((err) => err.message)
      .join(", ")}`;
  }
  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = `The ID ${err.value} is of invalid syntax. Kindly enter a valid ID.`;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorHandlerMiddleware;

/**
 * If you want to extract just the keys from an object and use them as values, you can achieve this in JavaScript using the Object.keys() method.
 */
