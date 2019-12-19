const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  bookings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "courtBooked"
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  fullName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  locationState: {
    type: String,
    default: "No Location Saved"
  },
  locationTown: {
    type: String,
    default: "No Location Saved"
  },
  locationSaved: {
    type: Boolean,
    default: false
  },
  locationDenied: {
    type: Boolean,
    default: false
  },
  clubsFollowing: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "tennisClub"
  },
  notifications: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "notification"
  }
});

module.exports = User = mongoose.model("user", UserSchema);
