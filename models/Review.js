const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  tour: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  text: { type: String, required: true },
  initials: { type: String, required: true },
  avatarBg: { type: String, default: '#046148' },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Review', reviewSchema);
