const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3001";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3002";
const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3003";

const createServiceProxy = (target, serviceName) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    proxyTimeout: 5000,
    timeout: 5000,
    pathRewrite: (_path, req) => req.originalUrl,
    on: {
      error: (error, req, res) => {
        console.error(
          `[API Gateway] ${serviceName} yönlendirme hatası: ${error.message}`,
        );

        if (res.headersSent) {
          return;
        }

        res.status(502).json({
          success: false,
          message: `${serviceName} servisine erişilemedi`,
          path: req.originalUrl,
        });
      },
    },
  });

const app = express();

app.disable("x-powered-by");

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway çalışıyor",
    timestamp: new Date().toISOString(),
    services: {
      userService: USER_SERVICE_URL,
      orderService: ORDER_SERVICE_URL,
      productService: PRODUCT_SERVICE_URL,
    },
  });
});

app.use("/api/users", createServiceProxy(USER_SERVICE_URL, "User Service"));
app.use("/api/orders", createServiceProxy(ORDER_SERVICE_URL, "Order Service"));
app.use(
  "/api/products",
  createServiceProxy(PRODUCT_SERVICE_URL, "Product Service"),
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `${req.originalUrl} adresi API Gateway üzerinde bulunamadı`,
  });
});

module.exports = app;
