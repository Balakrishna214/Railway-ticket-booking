const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seatsBooked: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
});

module.exports = mongoose.model('Booking', bookingSchema);