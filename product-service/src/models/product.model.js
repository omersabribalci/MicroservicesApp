const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Urun adi zorunludur",
        },
        len: {
          args: [2, 100],
          msg: "Urun adi 2 ile 100 karakter arasinda olmalidir",
        },
      },
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        name: "products_sku_unique",
        msg: "Bu SKU zaten kayitli",
      },
      set(value) {
        this.setDataValue(
          "sku",
          value ? String(value).trim().toUpperCase() : value,
        );
      },
      validate: {
        notEmpty: {
          msg: "SKU alani zorunludur",
        },
        len: {
          args: [2, 50],
          msg: "SKU 2 ile 50 karakter arasinda olmalidir",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Aciklama en fazla 1000 karakter olabilir",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Fiyat gecerli bir sayi olmalidir",
        },
        min: {
          args: [0],
          msg: "Fiyat 0 dan kucuk olamaz",
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: "Stok tam sayi olmalidir",
        },
        min: {
          args: [0],
          msg: "Stok 0 dan kucuk olamaz",
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  },
);

module.exports = Product;
