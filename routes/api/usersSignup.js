const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult, body } = require("express-validator");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const Admin = require("../../models/Admin.js");
const Instructor = require("../../models/Instructor.js");

router.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  let admin = await Admin.findOne({ email: req.body.email });
  let instructor = await Instructor.findOne({ email: req.body.email });
  try {
    if (user || admin || instructor) {
      return res
        .status(400)
        .json({ errors: [{ msg: "That email is already being used" }] });
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }

  if (!user) {
    let firstNameUnAltered = req.body.firstName.split("");
    firstNameUnAltered[0] = firstNameUnAltered[0].toUpperCase();
    let firstName = firstNameUnAltered.join("");
    let lastNameUnAltered = req.body.lastName.split("");
    lastNameUnAltered[0] = lastNameUnAltered[0].toUpperCase();
    let lastName = lastNameUnAltered.join("");
    let newUser = new User({
      firstName: firstName,
      lastName: lastName,
      fullName: firstName + " " + lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.createPassword,
      age: req.body.age,
      gender: req.body.gender
    });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(req.body.createPassword, salt);

    await newUser.save();

    const payload = {
      user: {
        user: true,
        id: newUser.id,
        userName: `${newUser.firstName} ${newUser.lastName}`
      }
    };
    jwt.sign(
      payload,
      config.get("userSecret"),
      { expiresIn: 36000000 },
      (error, token) => {
        if (error) {
          throw error;
        } else {
          res.status(200).json({ token });
        }
      }
    );
  }
});

module.exports = router;
