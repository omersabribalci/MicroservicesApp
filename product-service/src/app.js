const express = require("express");
const productRoutes = require("./routes/product.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product Service calisiyor",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `${req.originalUrl} adresi bulunamadi`,
  });
});

app.use(errorHandler);

module.exports = app;
