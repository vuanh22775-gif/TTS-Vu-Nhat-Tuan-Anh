const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  country: { type: String, required: true },
  region: { type: String, required: true }, // 'Châu Á', 'Châu Âu', 'Châu Mỹ', 'Châu Úc'
  title: { type: String, required: true },
  processingTime: { type: String, required: true }, // e.g., "5-7 ngày"
  price: { type: String, required: true },
  documents: [{ type: String }], // array of required documents
  description: { type: String },
  image: { type: String },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Visa', visaSchema);
