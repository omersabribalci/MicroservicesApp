const ApiResponse = require("../utils/apiResponse");

const errorHandler = (error, req, res, _next) => {
  console.error(`[HATA] ${error.message}`);

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    const validationErrors = error.errors.map((err) => err.message);
    return ApiResponse.badRequest(res, "Dogrulama hatasi", validationErrors);
  }

  return ApiResponse.error(
    res,
    process.env.NODE_ENV === "development"
      ? error.message
      : "Sunucu hatasi olustu",
  );
};

module.exports = errorHandler;
