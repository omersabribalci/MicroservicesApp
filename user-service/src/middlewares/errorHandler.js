const ApiResponse = require("../utils/apiResponse");

const errorHandler = (error, req, res, _next) => {
  console.error(`[HATA] ${error.message}`);

  if (error.name === "ValidationError") {
    const validationErrors = Object.values(error.errors).map(
      (err) => err.message,
    );
    return ApiResponse.badRequest(res, "Doğrulama hatası", validationErrors);
  }

  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue).join(", ");
    return ApiResponse.badRequest(res, `Bu ${duplicateField} zaten kayıtlı`);
  }

  if (error.name === "CastError") {
    return ApiResponse.badRequest(res, "Geçersiz ID formatı");
  }

  return ApiResponse.error(
    res,
    process.env.NODE_ENV === "development"
      ? error.message
      : "Sunucu hatası oluştu",
  );
};

module.exports = errorHandler;
