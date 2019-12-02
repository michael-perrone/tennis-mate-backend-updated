const express = require("express");
const router = express.Router();
const instructorAuth = require("../../middleware/authInstructor");
const Instructor = require("../../models/Instructor");
const CourtBooked = require("../../models/CourtBooked");

router.get("/", async (req, res) => {
  try {
    //   let instructor = await Instructor.findOne({ _id: req.instructor.id });
    // let bookings = await CourtBooked.find({ _id: instructor.bookings });
    // if (bookings.length > 0) {
    if (1 > 0) {
      res.status(200).json({ hi: "bookings" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
