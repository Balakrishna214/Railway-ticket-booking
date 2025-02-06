const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainName: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
});

module.exports = mongoose.model('Train', trainSchema);