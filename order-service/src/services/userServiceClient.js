const axios = require("axios");

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3001";

const userServiceClient = axios.create({
  baseURL: USER_SERVICE_URL,
  timeout: 5000,
});

const getUserById = async (userId) => {
  try {
    const response = await userServiceClient.get(`/api/users/${userId}`);
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }

    console.error(
      `User Service isteği başarısız (userId: ${userId}):`,
      error.message,
    );
    return null;
  }
};

module.exports = { getUserById };
