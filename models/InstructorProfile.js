const mongoose = require("mongoose");

const instructorProfileSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructor"
  },
  yearsTeaching: String,
  location: String,
  certifications: [
    {
      certifiedBy: String,
      certificationDate: String
    }
  ],
  jobExperience: [
    {
      jobTitle: String,
      clubName: {
        type: String
      },
      jobDuration: String
    }
  ],
  bio: String,
  photo: String,
  lessonRate: String
});

const InstructorProfile = mongoose.model(
  "instructorProfile",
  instructorProfileSchema
);

module.exports = InstructorProfile;
