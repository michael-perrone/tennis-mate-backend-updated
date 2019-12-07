const express = require("express");
const router = express.Router();
const TennisClub = require("../../models/TennisClub");
const User = require("../../models/User");
const CourtBooked = require("../../models/CourtBooked");

router.post("/", async (req, res) => {
  const tennisClub = await TennisClub.findOne({
    clubNameAllLower: req.body.clubNameAllLower
  });
  let users = await User.find({ _id: tennisClub.followers });
  const namesMatching = [];
  for (let i = 0; i < users.length; i++) {
    if (
      users[i].fullName
        .toLowerCase()
        .includes(req.body.customerName.toLowerCase())
    ) {
      namesMatching.push({ name: users[i].fullName, id: users[i]._id });
    }
  }
  if (namesMatching.length > 0) {
    res.status(200).json({ customers: namesMatching });
  } else {
    res.status(400).json({ error: "No one found" });
  }
});

router.post("/saveNewPlayers", async (req, res) => {
  const booking = await CourtBooked.findOne({ _id: req.body.bookingId });
  let oldPlayers = booking.players;
  booking.players = req.body.newPlayers;
  await booking.save();
  let newPlayers = booking.players;

  let samePlayers = [];
  let deletedPlayers = [];
  let playersAdded = [];
  for (let x = 0; x < oldPlayers.length; x++) {
    if (newPlayers.includes(oldPlayers[x])) {
      samePlayers.push(oldPlayers[x]);
    } else {
      deletedPlayers.push(oldPlayers[x]);
    }
  }
  for (let w = 0; w < newPlayers.length; w++) {
    if (oldPlayers.includes(newPlayers[w])) {
      samePlayers.push(newPlayers[w]);
    } else {
      playersAdded.push(newPlayers[w]);
    }
  }

  const players = await User.find({ _id: deletedPlayers });
  for (let i = 0; i < players.length; i++) {
    let newBookings = players[i].bookings.filter(eachBooking => {
      return eachBooking != booking.id;
    });
    players[i].bookings = newBookings;
    await players[i].save();
  }
  const newPlayersToAdd = await User.find({ _id: playersAdded });
  for (let t = 0; t < newPlayersToAdd.length; t++) {
    let playersBookings = [...newPlayersToAdd[t].bookings, booking.id];
    newPlayersToAdd[t].bookings = playersBookings;
    await newPlayersToAdd[t].save();
  }

  res.status(200).json({ booking });
});

module.exports = router;
