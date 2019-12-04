const express = require("express");
const router = express.Router();
const instructorAuth = require("../../middleware/authInstructor");
const Instructor = require("../../models/Instructor");
const CourtBooked = require("../../models/CourtBooked");
const userAuth = require("../../middleware/authUser");

router.get("/", userAuth, async (req, res) => {
  try {
    let bookings = await CourtBooked.find({ players: req.user.id });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
