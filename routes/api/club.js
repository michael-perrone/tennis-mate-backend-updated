const router = require("express").Router();
const TennisClub = require("../../models/TennisClub");
const ClubProfile = require("../../models/ClubProfile");
const Instructor = require("../../models/Instructor");

router.post("/", async (req, res) => {
  const clubAndProfileInfo = {};
  const individualTennisClub = await TennisClub.findOne({
    clubNameAllLower: req.body.clubName
  });
  clubAndProfileInfo.club = individualTennisClub;
  let instructors;
  if (individualTennisClub) {
    const clubsProfile = await ClubProfile.findOne({
      tennisClub: individualTennisClub._id
    });
    clubAndProfileInfo.profile = clubsProfile;
    if (clubsProfile) {
      instructors = await Instructor.find({
        _id: clubsProfile.instructorsWhoAccepted
      });
    }
  }

  res.status(200).json({ tennisClub: clubAndProfileInfo, instructors });
});

module.exports = router;
