const mongoose = require('mongoose');

const comboVoucherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'hotel', 'resort', 'flight_hotel', 'tour_package'
  region: { type: String }, // 'Miền Bắc', 'Miền Trung', 'Miền Nam'
  originalPrice: { type: String, required: true },
  discountedPrice: { type: String, required: true },
  discount: { type: String }, // e.g., "-20%"
  expiryDate: { type: String }, // e.g., "31/12/2024"
  badge: { type: String }, // 'Hot', 'Mới', 'Bán chạy'
  badgeColor: { type: String, default: '#C9A96E' },
  description: { type: String },
  image: { type: String },
  highlights: [{ type: String }], // e.g., ["Free breakfast", "Late checkout"]
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('ComboVoucher', comboVoucherSchema);
