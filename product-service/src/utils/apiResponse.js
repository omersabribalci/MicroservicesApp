class ApiResponse {
  static success(res, data, message = "Islem basarili", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data, message = "Kayit basariyla olusturuldu") {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(
    res,
    message = "Bir hata olustu",
    statusCode = 500,
    errors = null,
  ) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static notFound(res, message = "Kayit bulunamadi") {
    return ApiResponse.error(res, message, 404);
  }

  static badRequest(res, message = "Gecersiz istek", errors = null) {
    return ApiResponse.error(res, message, 400, errors);
  }
}

module.exports = ApiResponse;
