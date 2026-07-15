const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    tourName: { type: String },
    unitPrice: { type: Number, default: 0 }, // giá 1 khách (VNĐ)
    totalPrice: { type: Number, default: 0 }, // tổng tiền (VNĐ)
    numberOfGuests: { type: Number, required: true },
    departureDate: { type: Date },
    visitorId: { type: String }, // dùng để đối chiếu với Visit, tính tỉ lệ chuyển đổi
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    notes: { type: String },
  },
  { timestamps: true }
);
//heheheheeh

// Tự sinh mã đặt tour dạng VBT-YYMMDD-XXXX nếu chưa có
bookingSchema.pre('validate', function (next) {
  if (!this.bookingCode) {
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randPart = Math.random().toString(36).slice(2, 6).toUpperCase();
    this.bookingCode = `VBT-${datePart}-${randPart}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
