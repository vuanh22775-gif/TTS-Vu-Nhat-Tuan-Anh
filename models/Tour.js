const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: String, required: true },
  originalPrice: { type: String },
  badge: { type: String },
  badgeColor: { type: String, default: '#C9A96E' },
  rating: { type: Number, default: 5, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  image: { type: String, required: true },
  type: { type: String, enum: ['domestic', 'international'], default: 'domestic' },
  description: { type: String },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Tour', tourSchema);
