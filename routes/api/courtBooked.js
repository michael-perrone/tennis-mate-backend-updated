const express = require("express");
const router = express.Router();
const CourtBooked = require("../../models/CourtBooked");

router.post("/", async (req, res) => {
  try {
    let newCourtBooked = new CourtBooked({
      bookingType: req.body.booking.bookingType,
      instructorBooked: req.body.booking.instructorId,
      instructorName: req.body.booking.instructorName,
      bookedBy: req.body.booking.bookedBy,
      clubName: req.body.booking.clubName,
      courtIds: req.body.booking.courtIds,
      timeStart: req.body.booking.timeStart,
      timeEnd: req.body.booking.timeEnd,
      minutes: req.body.booking.minutes,
      date: req.body.booking.date,
      players: req.body.players
    });
    await newCourtBooked.save();

    if (newCourtBooked) {
      const bookings = await CourtBooked.find({ clubName: req.body.clubName });
      res.status(200).json({ newBooking: newCourtBooked, bookings });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/getcourts", async (req, res) => {
  try {
    const bookings = await CourtBooked.find({ clubName: req.body.clubName });
    if (bookings.length > 0) {
      res.status(200).json({ bookings });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
