require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway ${PORT} portunda çalışıyor`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Users API: http://localhost:${PORT}/api/users`);
  console.log(`Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
});
