const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const CourtBooked = require("../../models/CourtBooked");

router.post("/", async (req, res) => {
  let booking = await CourtBooked.findOne({ _id: req.body.bookingId });
  let players = await User.find({ _id: booking.players });
  let playersToSendBack = [];
  if (players.length > 0) {
    for (let i = 0; i < players.length; i++) {
      playersToSendBack.push({ name: players[i].fullName, id: players[i]._id });
    }
    if (playersToSendBack.length > 0) {
      res.status(200).json({ players: playersToSendBack });
    } else {
      res.status(404).json({ error: "I guess not founds" });
    }
  }
});

module.exports = router;
