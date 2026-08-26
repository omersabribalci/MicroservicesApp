const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB bağlantısı başarılı: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB bağlantı hatası: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
