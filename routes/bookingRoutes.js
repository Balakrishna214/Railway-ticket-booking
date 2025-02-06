const express = require("express");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const { authMiddleware } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const User = require("../models/User");


const router = express.Router();
router.use(cookieParser());

// Book a ticket (Protected route)
router.post("/", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { trainId, seatsBooked } = req.body;
    const userId = req.user._id; // Get user ID from the token

    // Check if seats are available
    const train = await Train.findById(trainId).session(session);
    console.log(train);
    
    if (train.availableSeats < seatsBooked) {
      throw new Error("Not enough seats available");
    }

    // Update available seats
    train.availableSeats -= seatsBooked;
    await train.save({ session });

    // Create booking
    const booking = new Booking({ trainId, userId, seatsBooked });
    await booking.save({ session });

    // Fetch user details
    const user = await User.findById(userId).session(session);

    // Commit the transaction
    await session.commitTransaction();

    // Response with user, train, and booking details
    res.status(201).json({
      message: "Ticket booked successfully",
      user: {
        name: user.name,
        email: user.email,
      },
      train: {
        trainName: train.trainName,
        source: train.source,
        destination: train.destination,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
      },
      booking: {
        bookingId: booking._id,
        seatsBooked: booking.seatsBooked,
        status: booking.status,
      },
    });
  } catch (err) {
    console.log(err.message);
    
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Cancel a booking (Protected route)
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.findById(req.params.id).session(session);
    if (!booking || booking.status === "cancelled") {
      throw new Error("Booking not found or already cancelled");
    }

    // Refund seats to the train
    const train = await Train.findById(booking.trainId).session(session);
    train.availableSeats += booking.seatsBooked;
    await train.save({ session });

    // Update booking status
    booking.status = "cancelled";
    await booking.save({ session });

    // Fetch user details
    const user = await User.findById(booking.userId).session(session);

    // Commit the transaction
    await session.commitTransaction();

    // Response with user, train, and cancellation details
    res.json({
      message: "Ticket cancelled successfully",
      user: {
        name: user.name,
        email: user.email,
      },
      train: {
        trainName: train.trainName,
        source: train.source,
        destination: train.destination,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
      },
      booking: {
        bookingId: booking._id,
        seatsBooked: booking.seatsBooked,
        status: booking.status,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;