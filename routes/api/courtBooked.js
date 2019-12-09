const express = require("express");
const router = express.Router();
const CourtBooked = require("../../models/CourtBooked");
const Instructor = require("../../models/Instructor");
const User = require("../../models/User");

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
    if (req.body.players.length > 0) {
      const players = await User.find({ _id: newCourtBooked.players });
      for (let i = 0; i < players.length; i++) {
        let previousPlayersBookings = [...players[i].bookings];
        previousPlayersBookings.push(newCourtBooked._id);
        players[i].bookings = previousPlayersBookings;
        players[i].save();
      }
    }
    await newCourtBooked.save();

    if (newCourtBooked) {
      const bookings = await CourtBooked.find({
        clubName: req.body.booking.clubName,
        date: req.body.date
      });
      res.status(200).json({ newBooking: newCourtBooked, bookings });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/getcourts", async (req, res) => {
  try {
    const bookings = await CourtBooked.find({
      clubName: req.body.clubName,
      date: req.body.date
    });
    res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete", async (req, res) => {
  try {
    let booking = await CourtBooked.findOne({ _id: req.body.bookingId });
    if (booking) {
      let instructor = await Instructor.findOne({
        _id: CourtBooked.instructorBooked
      });
      if (instructor) {
        let newInstructorBookings = instructor.bookings.filter(
          eachBooking => eachBooking._id !== booking.id
        );
        instructor.bookings = newInstructorBookings;
        instructor.save();
      }
      let players = await User.find({ _id: booking.players });
      if (players.length) {
        for (let i = 0; i < players.length; i++) {
          let newPlayerBookings = players[i].bookings.filter(
            eachBooking => eachBooking._id !== booking.id
          );
          players[i].bookings = newPlayerBookings;
          players[i].save();
        }
      }
    }
    await CourtBooked.findOneAndDelete({ _id: req.body.bookingId });
    let bookings = await CourtBooked.find({
      clubName: req.body.clubName,
      date: req.body.date
    });
    res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
