const mongoose = require("mongoose");

const CourtBookedSchema = new mongoose.Schema({
  timeStart: String,
  timeEnd: String,
  bookedBy: String,
  courtIds: [String],
  minutes: String,
  clubName: String,
  date: String,
  instructorName: {
    type: String,
    default: "None"
  },
  instructorBooked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructor"
  },
  bookingType: {
    required: true,
    type: String
  },
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user"
  }
});

const CourtBooked = mongoose.model("courtBooked", CourtBookedSchema);

module.exports = CourtBooked;
