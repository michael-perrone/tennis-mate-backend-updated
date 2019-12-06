const express = require("express");
const router = express.Router();
const CourtBooked = require("../../models/CourtBooked");

router.post("/", async (req, res) => {
  let booking = await CourtBooked.findOne({ _id: req.body.bookingId });
  booking.bookedBy = req.body.rebookName;
  await booking.save();
  console.log(booking);
  if (booking) {
    res.status(200).send();
  }
});

module.exports = router;
