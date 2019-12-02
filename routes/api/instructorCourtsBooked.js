const express = require("express");
const router = express.Router();
const Instructor = require("../../models/Instructor");

router.post("/", async (req, res) => {
  try {
    const InstructorFound = await Instructor.findById({
      _id: req.body.instructorId
    });

    InstructorFound.bookings = [
      req.body.newBooking,
      ...InstructorFound.bookings
    ];

    await InstructorFound.save();
    res.status(200).json({ InstructorFound });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
