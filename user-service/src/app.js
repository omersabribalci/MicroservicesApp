const express = require("express");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Service çalışıyor",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `${req.originalUrl} adresi bulunamadı`,
  });
});

app.use(errorHandler);

module.exports = app;
