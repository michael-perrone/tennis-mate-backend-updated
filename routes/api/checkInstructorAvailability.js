const express = require("express");
const Instructor = require("../../models/Instructor");
const CourtBooked = require("../../models/CourtBooked");
const router = express.Router();

router.post("/", async (req, res) => {
  const instructor = await Instructor.findOne({ _id: req.body.instructorId });
  let instructorBookings = await CourtBooked.find({
    instructorBooked: req.body.instructorId,
    date: req.body.date
  });

  for (let i = 0; i < instructorBookings.length; i++) {
    let length = instructorBookings[i].courtIds.length;
    let courtIds = instructorBookings[i].courtIds;
    for (let e = 0; e < length; e++) {
      console.log(length);
      let courtId1Array = courtIds[e].split("");
      courtId1Array.shift();
      let realCourtId1 = courtId1Array.join("");
      for (let m = 0; m < req.body.courtIds.length; m++) {
        console.log(realCourtId1);
        if (realCourtId1 === req.body.courtIds[m]) {
          return res.status(200).json({ bookingNotOkay: true });
        }
      }
    }
  }
  return res.status(200).json({ bookingNotOkay: false });
});

module.exports = router;
