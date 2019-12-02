const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructor"
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin"
  },
  notificationType: String,
  notificationDate: Date,
  notificationRead: {
    type: Boolean,
    default: false
  },
  notificationMessage: String,
  notificationFrom: String,
  notificationFromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  notificationFromTennisClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tennisClub"
  },
  answer: String
});

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
