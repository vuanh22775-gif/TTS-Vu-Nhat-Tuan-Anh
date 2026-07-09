const mongoose = require('mongoose');

// Mỗi lần khách xem trang chi tiết một tour sẽ tạo 1 bản ghi Visit.
// Khi khách đặt tour thành công, bản ghi Visit gần nhất (cùng visitorId + tourId)
// sẽ được đánh dấu converted = true để tính tỉ lệ "đặt / không đặt".
const visitSchema = new mongoose.Schema(
  {
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    tourName: { type: String },
    visitorId: { type: String, required: true, index: true },
    converted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

visitSchema.index({ tourId: 1, createdAt: -1 });

module.exports = mongoose.model('Visit', visitSchema);
