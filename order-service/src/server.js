require("dotenv").config();
const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Order Service ${PORT} portunda çalışıyor`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API: http://localhost:${PORT}/api/orders`);
  });
};

startServer();
