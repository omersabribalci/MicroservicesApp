require("dotenv").config();
const app = require("./app");
const { connectDatabase } = require("./config/database");
require("./models/product.model");

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Product Service ${PORT} portunda calisiyor`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API: http://localhost:${PORT}/api/products`);
  });
};

startServer();
