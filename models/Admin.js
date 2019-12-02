const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  clubName: {
    type: String,
    required: true
  },
  tennisClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tennisClub"
  },
  notifications: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "notification"
  }
});
const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;
