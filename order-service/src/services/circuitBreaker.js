const ServiceUnavailableError = require("../errors/serviceUnavailableError");

class CircuitBreakerOpenError extends ServiceUnavailableError {
  constructor(message) {
    super(message);
    this.name = "CircuitBreakerOpenError";
  }
}

class CircuitBreaker {
  constructor(options = {}) {
    this.name = options.name || "Unknown Service";
    this.failureThreshold = Number(options.failureThreshold) || 3;
    this.resetTimeoutMs = Number(options.resetTimeoutMs) || 10000;
    this.state = "CLOSED";
    this.failureCount = 0;
    this.openedAt = null;
  }

  canRequest() {
    if (this.state !== "OPEN") {
      return true;
    }

    const shouldTryAgain = Date.now() - this.openedAt >= this.resetTimeoutMs;

    if (shouldTryAgain) {
      this.state = "HALF_OPEN";
      return true;
    }

    return false;
  }

  onSuccess() {
    this.state = "CLOSED";
    this.failureCount = 0;
    this.openedAt = null;
  }

  onFailure() {
    if (this.state === "HALF_OPEN") {
      this.state = "OPEN";
      this.openedAt = Date.now();
      return;
    }

    this.failureCount += 1;

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.openedAt = Date.now();
    }
  }

  async execute(action) {
    if (!this.canRequest()) {
      throw new CircuitBreakerOpenError(
        `${this.name} için circuit breaker açık. Bir süre sonra tekrar deneyin`,
      );
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}

module.exports = {
  CircuitBreaker,
  CircuitBreakerOpenError,
};
