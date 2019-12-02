const mongoose = require("mongoose");
const tennisClubProfileSchema = new mongoose.Schema({
  tennisClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tennisClub"
  },
  instructorsToSendInvite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor"
    }
  ],
  instructorsWhoAccepted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor"
    }
  ],
  services: [],
  events: [],
  bio: String,
  otherServices: []
});

const ClubProfile = mongoose.model("clubProfile", tennisClubProfileSchema);

module.exports = ClubProfile;
