const express = require("express");
const router = express.Router();
const authUser = require("../../middleware/authUser");
const authInstructor = require("../../middleware/authInstructor");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Instructor = require("../../models/Instructor");
const { check, validationResult } = require("express-validator");
const config = require("config");
const Admin = require("../../models/Admin");
const TennisClub = require("../../models/TennisClub");

//@route GET api/auth
// desc test route
// access public
router.get("/user", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
  } catch (error) {
    console.log(error);
    res.status(500).send("Didnt Work");
  }
});

router.get("/instructor", authInstructor, (req, res) => {
  res.send("auth route");
});

router.post("/login", async (req, res) => {
  let adminLoggingIn = await Admin.findOne({ email: req.body.email });

  let userLoggingIn = await User.findOne({ email: req.body.email });

  if (adminLoggingIn) {
    const passwordsMatching = await bcrypt.compare(
      req.body.password,
      adminLoggingIn.password
    );
    if (passwordsMatching) {
      const tennisClub = await TennisClub.findOne({
        _id: adminLoggingIn.tennisClub
      });
      const payload = {
        admin: {
          clubId: `${adminLoggingIn.tennisClub._id}`,
          clubName: tennisClub.clubNameAllLower,
          id: `${adminLoggingIn.id}`,
          isAdmin: true,
          name: `${adminLoggingIn.firstName} ${adminLoggingIn.lastName}`
        }
      };
      jwt.sign(
        payload,
        config.get("adminSecret"),
        { expiresIn: 366000 },
        (error, token) => {
          res.status(200).json({ token: token, tennisClub: tennisClub });
        }
      );
    } else {
      res
        .status(400)
        .json({ error: "Email/Password Combination not recognized" });
    }
  }
  if (userLoggingIn) {
    const passwordsMatching = await bcrypt.compare(
      req.body.password,
      userLoggingIn.password
    );
    if (!passwordsMatching) {
      return res
        .status(401)
        .json({ error: "Email/Password Combination not recognized" });
    } else {
      const payload = {
        user: {
          userName: `${userLoggingIn.firstName} ${userLoggingIn.lastName}`,
          isUser: true,
          id: userLoggingIn.id
        }
      };

      jwt.sign(
        payload,
        config.get("userSecret"),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) {
            throw error;
          } else {
            res.status(200).json({ token });
          }
        }
      );
    }
  }
  if (!userLoggingIn && !adminLoggingIn) {
    let instructorLoggingIn = await Instructor.findOne({
      email: req.body.email
    });
    if (!instructorLoggingIn) {
      res.status(400).json({
        error: "Email/Password Combination not recognized"
      });
    } else {
      const isPasswordMatching = await bcrypt.compare(
        req.body.password,
        instructorLoggingIn.password
      );

      if (!isPasswordMatching) {
        return res
          .status(400)
          .json({ error: "Email/Password Combination not recognized" });
      }
      const payload = {
        instructor: {
          instructorName: `${instructorLoggingIn.firstName} ${instructorLoggingIn.lastName}`,
          isInstructor: true,
          id: instructorLoggingIn.id,
          clubName: instructorLoggingIn.tennisClub
        }
      };
      jwt.sign(
        payload,
        config.get("instructorSecret"),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) {
            throw error;
          } else {
            res.status(200).json({ token });
          }
        }
      );
    }
  }
});

module.exports = router;
