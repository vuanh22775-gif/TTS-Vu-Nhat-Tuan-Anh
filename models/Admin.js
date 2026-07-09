const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // should be hashed in production
    email: { type: String },
    fullName: { type: String },
    role: { type: String, enum: ['admin', 'manager'], default: 'admin' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
