const axios = require("axios");
const ServiceUnavailableError = require("../errors/serviceUnavailableError");
const { CircuitBreaker, CircuitBreakerOpenError } = require("./circuitBreaker");

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3001";
const USER_SERVICE_TIMEOUT_MS =
  Number(process.env.USER_SERVICE_TIMEOUT_MS) || 5000;
const USER_SERVICE_MAX_RETRIES =
  Number(process.env.USER_SERVICE_MAX_RETRIES) || 2;
const USER_SERVICE_RETRY_DELAY_MS =
  Number(process.env.USER_SERVICE_RETRY_DELAY_MS) || 500;
const USER_SERVICE_CIRCUIT_BREAKER_FAILURE_THRESHOLD =
  Number(process.env.USER_SERVICE_CIRCUIT_BREAKER_FAILURE_THRESHOLD) || 3;
const USER_SERVICE_CIRCUIT_BREAKER_RESET_TIMEOUT_MS =
  Number(process.env.USER_SERVICE_CIRCUIT_BREAKER_RESET_TIMEOUT_MS) || 10000;

const userServiceClient = axios.create({
  baseURL: USER_SERVICE_URL,
  timeout: USER_SERVICE_TIMEOUT_MS,
});

const userServiceCircuitBreaker = new CircuitBreaker({
  name: "User Service",
  failureThreshold: USER_SERVICE_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
  resetTimeoutMs: USER_SERVICE_CIRCUIT_BREAKER_RESET_TIMEOUT_MS,
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const status = error.response?.status;
  const retryableCodes = [
    "ECONNABORTED",
    "ECONNRESET",
    "ECONNREFUSED",
    "ENOTFOUND",
    "EAI_AGAIN",
  ];

  return (
    retryableCodes.includes(error.code) ||
    status === 429 ||
    status >= 500 ||
    !status
  );
};

const fetchUserByIdWithRetry = async (userId) => {
  const totalAttempts = USER_SERVICE_MAX_RETRIES + 1;
  let lastError = null;

  for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
    try {
      const response = await userServiceClient.get(`/api/users/${userId}`);
      return response.data.data;
    } catch (error) {
      const status = error.response?.status;

      if (status === 404) {
        return null;
      }

      if (status >= 400 && status < 500 && status !== 429) {
        return null;
      }

      lastError = error;
      const isLastAttempt = attempt === totalAttempts;

      console.warn(
        `[Retry] User Service isteği başarısız oldu (${attempt}/${totalAttempts}): ${error.message}`,
      );

      if (!isRetryableError(error) || isLastAttempt) {
        break;
      }

      await wait(USER_SERVICE_RETRY_DELAY_MS * attempt);
    }
  }

  throw new ServiceUnavailableError(
    "User Service geçici olarak kullanılamıyor. Lütfen tekrar deneyin",
    { cause: lastError },
  );
};

const getUserById = async (userId, options = {}) => {
  const { useFallbackOnFailure = false } = options;

  try {
    return await userServiceCircuitBreaker.execute(() =>
      fetchUserByIdWithRetry(userId),
    );
  } catch (error) {
    const isUnavailableError =
      error instanceof CircuitBreakerOpenError ||
      error instanceof ServiceUnavailableError;

    if (!isUnavailableError) {
      throw error;
    }

    console.error(
      `[User Service Client] Dayanıklılık koruması devrede (userId: ${userId}): ${error.message}`,
    );

    if (useFallbackOnFailure) {
      return null;
    }

    throw error;
  }
};

module.exports = { getUserById };
