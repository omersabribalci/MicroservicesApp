const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "product_service",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
  },
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(
      `MySQL baglantisi basarili: ${process.env.DB_HOST || "localhost"}:${
        process.env.DB_PORT || 3306
      }/${process.env.DB_NAME || "product_service"}`,
    );
  } catch (error) {
    console.error(`MySQL baglanti hatasi: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDatabase,
};
