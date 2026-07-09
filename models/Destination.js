const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  tours: { type: Number, default: 0 },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Destination', destinationSchema);
