const express = require("express");
const router = express.Router();
const userAuth = require("../../middleware/authUser");
const User = require("../../models/User");
const TennisClub = require("../../models/TennisClub");

router.get("/", userAuth, async (req, res) => {
  const tennisClubs = await TennisClub.find({ followers: req.user.id });
  console.log(tennisClubs.length);
  if (tennisClubs.length) {
    return res.status(200).json({ tennisClubs });
  } else if (!tennisClubs.length) {
    return res.status(204).send();
  }

  /*  if (user && tennisClubs) {

    return res.status(200).json({ tennisClubs });
  } */
});

module.exports = router;
