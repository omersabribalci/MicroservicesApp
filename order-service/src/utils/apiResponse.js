class ApiResponse {
  static success(res, data, message = "İşlem başarılı", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data, message = "Kayıt başarıyla oluşturuldu") {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(
    res,
    message = "Bir hata oluştu",
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

  static notFound(res, message = "Kayıt bulunamadı") {
    return ApiResponse.error(res, message, 404);
  }

  static badRequest(res, message = "Geçersiz istek", errors = null) {
    return ApiResponse.error(res, message, 400, errors);
  }
}

module.exports = ApiResponse;
