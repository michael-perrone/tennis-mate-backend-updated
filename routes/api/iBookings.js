const express = require("express");
const router = express.Router();
const CourtBooked = require("../../models/CourtBooked");

router.post("/", async (req, res) => {
  /*  let todaysDate = new Date();
  let month = todaysDate.getMonth() + 1;
  let day = todaysDate.getDate();
  let year = todaysDate.getFullYear();

  let dateFormatted = `${month.toString()} ${day.toString()} ${year.toString()}`;
  console.log(dateFormatted);
 */
  let allBookings = await CourtBooked.find({
    instructorBooked: req.body.instructorId
  });

  let bookingsToSendBack = [];

  for (let i = 0; i < allBookings.length; i++) {
    if (allBookings[i].players.length > 0) {
      let playersGrabbed = allBookings[i].players;
      for (let x = 0; x < playersGrabbed.length; x++) {
        if (req.body.userId == playersGrabbed[x]) {
          console.log("DWDAWDWD");
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

module.exports = router;
