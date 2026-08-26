const express = require("express");
const orderRoutes = require("./routes/order.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Order Service çalışıyor",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `${req.originalUrl} adresi bulunamadı`,
  });
});

app.use(errorHandler);

module.exports = app;
