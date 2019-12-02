const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const userAuth = require("../../middleware/authUser");

router.get("/", userAuth, async (req, res) => {
  console.log(req.user);
  let user = await User.findOne({ _id: req.user.id });
  console.log(user);
  if (user) {
    try {
      return res.status(200).json({
        userLocationSaved: user.locationSaved,
        locationDenied: user.locationDenied,
        userState: user.locationState,
        userTown: user.locationTown
      });
    } catch (error) {
      return res.status(400).json({ error: "Bad Server Request" });
    }
  }
});

module.exports = router;
