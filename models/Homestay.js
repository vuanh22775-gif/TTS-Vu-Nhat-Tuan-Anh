const mongoose = require('mongoose');

const homestaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'homestay', 'villa'
  location: { type: String, required: true },
  region: { type: String, required: true }, // 'Miền Bắc', 'Miền Trung', 'Miền Nam'
  pricePerNight: { type: String, required: true },
  rating: { type: Number, default: 5, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  capacity: { type: Number }, // number of guests
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  amenities: [{ type: String }], // e.g., ["WiFi", "Air Conditioning", "Pool"]
  description: { type: String },
  image: { type: String },
  gallery: [{ type: String }], // array of image URLs
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '12:00' },
  cancellationPolicy: { type: String },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Homestay', homestaySchema);
