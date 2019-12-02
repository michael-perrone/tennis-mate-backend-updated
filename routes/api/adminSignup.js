const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const TennisClub = require("../../models/TennisClub");
const Admin = require("../../models/Admin");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const Instructor = require("../../models/Instructor");
const ClubProfile = require("../../models/ClubProfile");

router.post(
  "/",
  [
    check("tennisClub", "Please enter the club's name you wish to register"),
    check("firstName", "Please enter your first name")
      .not()
      .isEmpty(),
    check("lastName", "Please enter your last name")
      .not()
      .isEmpty(),

    check("email", "Enter a valid Email").isEmail(),
    check(
      "createPassword",
      "Enter a password eight characters or longer"
    ).isLength({ min: 8 }),
    check("phoneNumber", "Please enter a valid phone number").isMobilePhone()
  ],
  async (req, res) => {
    const errors = validationResult(req.body.admin);
    if (req.body.admin.createPassword != req.body.admin.passwordConfirm) {
      const passConfirmError = {
        msg: "Password's do not match",
        param: "passwordConfirm",
        location: "body"
      };
      const newErrors = [...errors.array(false), passConfirmError];
      return res.status(400).json({ errors: newErrors });
    } else {
      if (errors.array().length !== 0) {
        return res.status(400).json({ errors: errors.array(false) });
      } else {
        try {
          let instructor = await Instructor.findOne({ email: req.body.email });
          let admin = await Admin.findOne({ email: req.body.admin.email });
          let user = await User.findOne({ email: req.body.email });
          if (admin || user || instructor) {
            return res
              .status(400)
              .json({ errors: [{ msg: "That email is being used" }] });
          }

          let newTennisClub = new TennisClub({
            clubNameAllLower: req.body.admin.clubName
              .split(" ")
              .reduce((accum, element) => {
                return (accum += element);
              }),
            clubName: req.body.admin.clubName,
            address: req.body.tennisClub.clubAddress,
            city: req.body.tennisClub.clubCity,
            zip: req.body.tennisClub.clubZip,
            state: req.body.tennisClub.clubState,
            numberCourts: req.body.tennisClub.numberCourts,
            clubOpenTime: req.body.tennisClub.clubOpenTime,
            clubCloseTime: req.body.tennisClub.clubCloseTime,
            clubWebsite: req.body.tennisClub.clubWebsite,
            phoneNumber: req.body.tennisClub.phoneNumber
          });

          let newAdmin = new Admin({
            clubName: newTennisClub.clubNameAllLower,
            firstName: req.body.admin.firstName,
            lastName: req.body.admin.lastName,
            email: req.body.admin.email,
            password: req.body.admin.createPassword,
            tennisClub: newTennisClub,
            phoneNumber: req.body.admin.phoneNumber
          });
          const salt = await bcrypt.genSalt(10);
          newAdmin.password = await bcrypt.hash(
            req.body.admin.createPassword,
            salt
          );

          const payload = {
            admin: {
              clubName: newTennisClub.clubNameAllLower,
              name: `${newAdmin.firstName} ${newAdmin.lastName}`,
              isAdmin: true,
              id: newAdmin.id,
              clubId: newTennisClub.id
            }
          };

          jwt.sign(
            payload,
            config.get("adminSecret"),
            { expiresIn: 3600000 },
            (error, token) => {
              if (error) {
                console.log(error);
              } else {
                res.status(200).json({ token });
              }
            }
          );
          await newAdmin.save();
          await newTennisClub.save();
          return res.status(200).json({ success: "good shit bro" });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
);
module.exports = router;
