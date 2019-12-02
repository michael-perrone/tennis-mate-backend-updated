const express = require("express");
const router = express.Router();
const ClubProfile = require("../../models/ClubProfile");
const adminAuth = require("../../middleware/authAdmin");

router.post("/", adminAuth, async (req, res) => {
  try {
    if (req.body.eventsArray && req.body.eventsArray.length > 0) {
      let clubProfile = await ClubProfile.findOneAndUpdate(
        { tennisClub: req.admin.clubId },
        { $set: { events: req.body.eventsArray } },
        { new: true }
      );
      await clubProfile.save();
      res.json({ updatedProfile: clubProfile });
    } else if (req.body.eventsArray.length === 0) {
      let clubProfile = await ClubProfile.findOneAndUpdate(
        { tennisClub: req.admin.clubId },
        { $set: { events: [] } },
        { new: true }
      );
      await clubProfile.save();
      res.json({ updatedProfile: clubProfile });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
