const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  href: { type: String, default: '#' },
  icon: { type: String, required: true }, // key để views/partials/icons.ejs chọn icon SVG
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Service', serviceSchema);
