const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vietbluetour';
  try {
    await mongoose.connect(uri);
    console.log('✅ Đã kết nối MongoDB:', uri);
    return true;
  } catch (err) {
    console.warn('⚠️ Không thể kết nối MongoDB, website sẽ dùng dữ liệu mẫu:', err.message);
    return false;
  }
}

module.exports = connectDB;
