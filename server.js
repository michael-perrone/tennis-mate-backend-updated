const express = require("express");
const app = express();
const cors = require("cors");
const connectedDatabase = require("./config/db");

app.use(cors());
connectedDatabase();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("hi");
});
app.use("/api/getInstructor", require("./routes/api/getInstructor"));
app.use("/api/getBookings", require("./routes/api/getBookings"));
app.use("/api/notifications", require("./routes/api/notifications"));
app.use("/api/courtBooked", require("./routes/api/courtBooked"));
app.use("/api/club", require("./routes/api/club"));
app.use("/api/usersSignup", require("./routes/api/usersSignup"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/instructorSignup", require("./routes/api/instructorSignup"));
app.use("/api/instructorProfile", require("./routes/api/instructorProfile"));
app.use("/api/userProfile", require("./routes/api/userProfile"));
app.use("/api/adminSignup", require("./routes/api/adminSignup"));
app.use("/api/clubsList", require("./routes/api/clubsList"));
app.use("/api/clubProfile", require("./routes/api/clubProfile"));
app.use("/api/instructorList", require("./routes/api/instructorList"));
app.use("/api/getInstructors", require("./routes/api/getInstructors"));
app.use("/api/saveLocation", require("./routes/api/saveLocation"));
app.use(
  "/api/getUserLocationInfo",
  require("./routes/api/getUserLocationInfo")
);
app.use("/api/clubProfileEvents", require("./routes/api/clubProfileEvents"));
app.use(
  "/api/instructorCourtsBooked",
  require("./routes/api/instructorCourtsBooked")
);

app.use("/api/userSubscribe", require("./routes/api/userSubscribe"));

app.use("/api/userClubs", require("./routes/api/userClubs"));
app.use("/api/getCustomers", require("./routes/api/getCustomers"));
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("we here");
});
