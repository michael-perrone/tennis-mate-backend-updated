const express = require("express");
const router = express.Router();
const Instructor = require("../../models/Instructor");

router.post("/instructorSearch", async (req, res) => {
  let allInstructors = await Instructor.find({});
  let instructorsFromSearch = [];
  for (let i = 0; i < allInstructors.length; i++) {
    if (
      allInstructors[i].fullName
        .toLowerCase()
        .includes(req.body.name.toLowerCase())
    ) {
      instructorsFromSearch.push({
        id: allInstructors[i]._id,
        name: allInstructors[i].fullName,
        tennisClub: allInstructors[i].tennisClub
      });
    }
  }

  if (instructorsFromSearch.length > 0) {
    return res.status(200).json({ instructors: instructorsFromSearch });
  }
  if (instructorsFromSearch === null || instructorsFromSearch.length === 0) {
    return res.status(406).json({ error: "No Instructors Found" });
  }
});

module.exports = router;
