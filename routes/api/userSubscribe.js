const express = require("express");
const router = express.Router();
const TennisClub = require("../../models/TennisClub");
const User = require("../../models/User");

router.post("/", async (req, res) => {
  try {
    let subscriberExists = await TennisClub.find({
      followers: req.body.userId
    });
    let doesExist = false;
    for (let i = 0; i < subscriberExists.length; i++) {
      if (
        subscriberExists.length > 0 &&
        subscriberExists[i]._id == req.body.tennisClubId
      ) {
        doesExist = true;
      }
    }
    if (doesExist) {
      return res
        .status(406)
        .json({ error: "You have already subscribed to this club" });
    }
    let tennisClub = await TennisClub.findOne({ _id: req.body.tennisClubId });
    if (tennisClub) {
      tennisClub.followers.unshift(req.body.userId);
      await tennisClub.save();
    }
    let user = await User.findOne({ _id: req.body.userId });
    if (user) {
      user.clubsFollowing.unshift(req.body.tennisClubId);
      await user.save();
    }

    if (user && tennisClub) {
      res.status(200).json({ user, tennisClub });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/unfollow", async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.body.userId });
    let newClubsFollowing = user.clubsFollowing.filter(
      clubId => clubId != req.body.tennisClubId
    );
    let tennisClub = await TennisClub.findOne({ _id: req.body.tennisClubId });
    let newTennisClubFollowers = tennisClub.followers.filter(
      userId => userId != req.body.userId
    );
    if (user && tennisClub) {
      user.clubsFollowing = newClubsFollowing;
      await user.save();
      tennisClub.followers = newTennisClubFollowers;
      await tennisClub.save();
      let tennisClubsAfterFilter = await TennisClub.find({
        followers: user._id
      });
      return res.status(200).json({ tennisClubsAfterFilter });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
