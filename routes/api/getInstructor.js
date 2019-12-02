const express = require("express");
const router = express.Router();
const InstructorProfile = require("../../models/InstructorProfile");

router.post("/", async (req, res) => {
  try {
    let instructorProfile = await InstructorProfile.findOne({
      instructor: req.body.instructorId
    }).populate("instructor", [
      "firstName",
      "lastName",
      "tennisClub",
      "requestFrom",
      "requestPending",
      "tennisClubTeachingAt",
      "notifications",
      "clubAccepted",
      "bookings"
    ]);
    console.log(instructorProfile);
    if (instructorProfile) {
      return res.status(200).json({ instructorProfile, profileCreated: true });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
