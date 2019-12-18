const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/authAdmin");
const ClubProfile = require("../../models/ClubProfile");
const Instructor = require("../../models/Instructor");
const Notification = require("../../models/Notification");
const TennisClub = require("../../models/TennisClub");

router.get("/myclub", adminAuth, async (req, res) => {
  try {
    let clubProfile = await ClubProfile.findOne({
      tennisClub: req.admin.clubId
    });
    if (clubProfile) {
      const instructors = await Instructor.find({
        _id: clubProfile.instructorsToSendInvite
      });

      let instructorsToSendBack = [];

      for (let i = 0; i < instructors.length; i++) {
        let newObject = {
          id: instructors[i]._id,
          name: instructors[i].fullName
        };
        instructorsToSendBack.push(newObject);
      }

      const instructorsAlreadyHere = await Instructor.find({
        _id: clubProfile.instructorsWhoAccepted
      });

      clubProfile.instructorsWhoAccepted = instructorsAlreadyHere;
      return res.status(200).json({
        clubProfile,
        profileCreated: true,
        idAndName: instructorsToSendBack
      });
    }
    if (!clubProfile) {
      return res.status(406).json({ profileCreated: false });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    const instructorsBeingCurrentlyAdded = [];
    let clubProfileFields = {};
    let servicesArray = [];
    let otherServices = [];

    if (req.body.services && req.body.services.length > 0) {
      for (let i = 0; i < req.body.services.length; i++) {
        servicesArray.push(req.body.services[i]);
      }
      clubProfileFields.services = servicesArray;
    }

    if (req.body.otherServices && req.body.otherServices.length > 0) {
      for (let i = 0; i < req.body.otherServices.length; i++) {
        otherServices.push(req.body.otherServices[i]);
      }
    }

    if (req.body.otherServices && req.body.otherServices.length > 0) {
      clubProfileFields.otherServices = otherServices;
    }

    if (servicesArray.length > 0) {
      clubProfileFields.services = servicesArray;
    }

    if (req.body.bio) {
      clubProfileFields.bio = req.body.bio;
    }

    let clubProfile = await ClubProfile.findOne({
      tennisClub: req.admin.clubId
    });

    clubProfileFields.tennisClub = req.admin.clubId;

    if (clubProfile) {
      clubProfile = await ClubProfile.findOneAndUpdate(
        { tennisClub: req.admin.clubId },
        { $set: clubProfileFields },
        { new: true }
      );
      return res.json({
        clubProfile,
        instructorsForInstantAdd: instructorsBeingCurrentlyAdded
      });
    } else {
      clubProfile = new ClubProfile(clubProfileFields);
      await clubProfile.save();
      res.json(clubProfile);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/instructorDeleteFromClub", async (req, res) => {
  try {
    let tennisClubProfile = await ClubProfile.findOne({
      tennisClub: req.body.tennisClub
    });
    const newInstructors = tennisClubProfile.instructorsWhoAccepted.filter(
      instructor => {
        return !req.body.instructors.includes(instructor.toString());
      }
    );

    tennisClubProfile.instructorsWhoAccepted = newInstructors;

    for (let i = 0; i < req.body.instructors.length; i++) {
      let instructor = await Instructor.findOne({
        _id: req.body.instructors[i]
      });
      instructor.tennisClub = "No Current Club";
      instructor.clubAccepted = false;
      await instructor.save();
    }
    await tennisClubProfile.save();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/removeFromPending", async (req, res) => {
  try {
    let tennisClubProfile = await ClubProfile.findOne({
      tennisClub: req.body.tennisClub
    });
    const newInstructors = tennisClubProfile.instructorsToSendInvite.filter(
      instructor => {
        return !req.body.instructors.includes(instructor.toString());
      }
    );

    tennisClubProfile.instructorsToSendInvite = newInstructors;

    let pendingRemaining = await Instructor.find({
      _id: tennisClubProfile.instructorsToSendInvite
    });

    let pendingToSendBack = [];

    pendingRemaining.forEach(instructor => {
      pendingToSendBack.push({ id: instructor._id, name: instructor.fullName });
    });

    for (let i = 0; i < req.body.instructors.length; i++) {
      let instructor = await Instructor.findOne({
        _id: req.body.instructors[i]
      });
      let notificationUpHere = await Notification.findOne({
        instructorId: req.body.instructors[i],
        notificationFromTennisClub: req.body.tennisClub,
        notificationType: "Club Added Instructor"
      });

      let newinstructorNotifications = instructor.notifications.filter(
        notification => {
          return notification !== notificationUpHere._id;
        }
      );

      instructor.notifications = newinstructorNotifications;

      await instructor.save();

      await Notification.deleteOne(
        {
          instructorId: req.body.instructors[i],
          notificationFromTennisClub: req.body.tennisClub,
          notificationType: "Club Added Instructor"
        },
        function(error) {
          console.log(error);
        }
      );
    }
    await tennisClubProfile.save();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/getInstructorsPendingAndAccepted", async (req, res) => {
  let instructorsPending = await Instructor.find({ _id: req.body.pending });
  let pending = [];
  for (let i = 0; i < instructorsPending.length; i++) {
    pending.push({
      id: instructorsPending[i]._id,
      name: instructorsPending[i].fullName
    });
  }
  let instructorsAccepted = await Instructor.find({ _id: req.body.accepted });
  let accepted = [];
  for (let i = 0; i < instructorsAccepted.length; i++) {
    accepted.push({
      id: instructorsAccepted[i]._id,
      name: instructorsAccepted[i].fullName
    });
  }

  if (accepted.length > 0 || pending.length > 0) {
    res.status(200).json({ accepted, pending });
  }
});

router.post("/addInstructorsToClub", async (req, res) => {
  try {
    let tennisClubProfile = await ClubProfile.findOne({
      tennisClub: req.body.tennisClub
    });
    if (tennisClubProfile) {
      function checkIfDuplicates() {
        let sendError = "No Error";
        for (let x = 0; x < req.body.instructors.length; x++) {
          for (
            let y = 0;
            y < tennisClubProfile.instructorsToSendInvite.length;
            y++
          ) {
            if (
              req.body.instructors[x] ==
              tennisClubProfile.instructorsToSendInvite[y]
            ) {
              sendError = "You can not add the same instructor twice.";
              return sendError;
            }
            for (
              let z = 0;
              z < tennisClubProfile.instructorsWhoAccepted.length;
              z++
            ) {
              if (
                req.body.instructors[x] ==
                tennisClubProfile.instructorsWhoAccepted[z]
              ) {
                sendError =
                  "One of these instructors is already registered at your club.";
              }
            }
          }
        }
        return sendError;
      }
      if (checkIfDuplicates() === "No Error") {
        let tennisClub = await TennisClub.findOne({
          _id: req.body.tennisClub
        });
        let instructorsForInstantAdd = [];
        tennisClubProfile.instructorsToSendInvite.push(...req.body.instructors);
        tennisClubProfile.save();
        for (let z = 0; z < req.body.instructors.length; z++) {
          let instructor = await Instructor.findOne({
            _id: req.body.instructors[z]
          });
          instructorsForInstantAdd.push(instructor);
          instructor.requestFrom = req.body.tennisClub;
          instructor.requestPending = true;

          let newNotification = new Notification({
            instructorId: instructor._id,
            notificationType: "Club Added Instructor",
            notificationDate: new Date(),
            notificationFromTennisClub: tennisClub._id,
            notificationMessage: `You have been added as an instructor by ${tennisClub.clubName}. If you work here, accept this request and you will now be a registered employee of this Tennis Club.`
          });
          instructor.notifications.unshift(newNotification);
          await newNotification.save();
          await instructor.save();
        }
        res.status(200).json({
          tennisClubProfile,
          instructorsForInstantAdd: instructorsForInstantAdd
        });
      } else {
        res.status(406).json({ error: checkIfDuplicates() });
      }
    } else {
      if (req.body.instructors.length > 0) {
        let tennisClub = await TennisClub.findOne({
          _id: req.body.tennisClub
        });
        let clubProfile = new ClubProfile({
          instructorsToSendInvite: req.body.instructors,
          tennisClub: req.body.tennisClub
        });
        await clubProfile.save();
        let instructorsForInstantAdd = [];
        for (let f = 0; f < req.body.instructors.length; f++) {
          let instructorForInstant = await Instructor.findOne({
            _id: req.body.instructors[f]
          });
          instructorsForInstantAdd.push(instructorForInstant);
          let newNotification = new Notification({
            instructorId: instructorForInstant._id,
            notificationType: "Club Added Instructor",
            notificationDate: new Date(),
            notificationFromTennisClub: tennisClub._id,
            notificationMessage: `You have been added as an instructor by ${tennisClub.clubName}. If you work here, accept this request and you will now be a registered employee of this Tennis Club.`
          });
          instructorForInstant.notifications.unshift(newNotification);
          await newNotification.save();
          await instructorForInstant.save();
        }
        res.status(200).json({
          clubProfile,
          instructorsForInstantAdd: instructorsForInstantAdd
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
