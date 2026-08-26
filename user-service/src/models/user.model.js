const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Ad alanı zorunludur"],
      trim: true,
      minlength: [2, "Ad en az 2 karakter olmalıdır"],
      maxlength: [50, "Ad en fazla 50 karakter olabilir"],
    },
    lastName: {
      type: String,
      required: [true, "Soyad alanı zorunludur"],
      trim: true,
      minlength: [2, "Soyad en az 2 karakter olmalıdır"],
      maxlength: [50, "Soyad en fazla 50 karakter olabilir"],
    },
    email: {
      type: String,
      required: [true, "E-posta alanı zorunludur"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Geçerli bir e-posta adresi giriniz",
      ],
    },
    age: {
      type: Number,
      min: [0, "Yaş 0 dan küçük olamaz"],
      max: [150, "Yaş 150 den büyük olamaz"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
