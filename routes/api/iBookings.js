const express = require("express");
const router = express.Router();
const CourtBooked = require("../../models/CourtBooked");
const instructorAuth = require("../../middleware/authInstructor");

router.post("/", async (req, res) => {
  let allBookings = await CourtBooked.find({
    instructorBooked: req.body.instructorId
  });
  console.log(allBookings);

  let bookingsToSendBack = [];

  for (let i = 0; i < allBookings.length; i++) {
    if (allBookings[i].players.length > 0) {
      let playersGrabbed = allBookings[i].players;
      for (let x = 0; x < playersGrabbed.length; x++) {
        if (req.body.userId == playersGrabbed[x]) {
          bookingsToSendBack.push(allBookings[i]);
        }
      }
    }
  }
  if (bookingsToSendBack.length > 0) {
    res.status(200).json({ bookings: bookingsToSendBack });
  } else {
    res.status(204).send();
  }

  console.log(bookingsToSendBack);
});

router.get("/instructor", instructorAuth, async (req, res) => {
  let todaysDate = new Date();
  let month = todaysDate.getMonth() + 1;
  let day = todaysDate.getDate();
  let year = todaysDate.getFullYear();

  let dateFormatted = `${month.toString()} ${day.toString()} ${year.toString()}`;

  console.log(todaysDate);
  let instructorsBookings = await CourtBooked.find({
    instructorBooked: req.instructor.id,
    date: dateFormatted
  });
  console.log(instructorsBookings);

  res.status(200).json({ instructorsBookings });
});

router.post("/schedule", async (req, res) => {
  // month day year

  let dateChosen = req.body.date.split("-");
  let month = dateChosen[1];

  let day = dateChosen[2];
  let checkingDay = day.split("");
  if (checkingDay[0] == 0) {
    checkingDay.shift();
    day = checkingDay;
  } else {
    day = checkingDay.join("");
  }
  let year = dateChosen[0];

  let dateToUse = [month, day, year].join(" ");

  console.log(dateToUse, req.body.instructorId);
  let bookings = await CourtBooked.find({
    instructorBooked: req.body.instructorId,
    date: dateToUse
  });
  console.log(bookings);

  res.status(200).json({ bookings });
});

module.exports = router;
