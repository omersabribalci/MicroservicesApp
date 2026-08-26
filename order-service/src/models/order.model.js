const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Kullanıcı ID alanı zorunludur"],
    },
    product: {
      type: String,
      required: [true, "Ürün adı zorunludur"],
      trim: true,
      minlength: [2, "Ürün adı en az 2 karakter olmalıdır"],
    },
    quantity: {
      type: Number,
      required: [true, "Adet alanı zorunludur"],
      min: [1, "Adet en az 1 olmalıdır"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Toplam fiyat alanı zorunludur"],
      min: [0, "Toplam fiyat 0 dan küçük olamaz"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        message: "Geçersiz sipariş durumu",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
