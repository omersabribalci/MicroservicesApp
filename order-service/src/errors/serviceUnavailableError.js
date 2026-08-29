class ServiceUnavailableError extends Error {
  constructor(message = "Bağımlı servis şu anda kullanılamıyor", options = {}) {
    super(message);
    this.name = "ServiceUnavailableError";
    this.statusCode = 503;

    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

module.exports = ServiceUnavailableError;
