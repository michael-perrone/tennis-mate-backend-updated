const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const ClubProfile = require("../../models/ClubProfile");
const TennisClub = require("../../models/TennisClub");
const authUser = require("../../middleware/authUser");

router.post("/clubsFromCurrentLocation", authUser, async (req, res) => {
  let user = await User.findOne({ _id: req.user.id });
  let tennisClubsFromCityAndState = await TennisClub.find({
    city: req.body.city,
    state: req.body.state
  });
  let clubAndProfileFromStateAndCity = [];
  if (tennisClubsFromCityAndState.length > 0) {
    for (let i = 0; i < tennisClubsFromCityAndState.length; i++) {
      let profile = await ClubProfile.findOne({
        tennisClub: tennisClubsFromCityAndState[i].id
      });
      if (profile) {
        clubAndProfileFromStateAndCity.push({
          club: tennisClubsFromCityAndState[i],
          profile
        });
      }
    }
    if (clubAndProfileFromStateAndCity.length > 0)
      user.locationState = req.body.state;
    user.locationTown = req.body.city;
    user.locationSaved = true;
    user.locationDenied = false;
    user.save();
    res.status(200).json({ clubsBack: clubAndProfileFromStateAndCity });
  } else {
    let tennisClubsFromState = await TennisClub.find({ state: req.body.state });
    if (tennisClubsFromState.length > 0) {
      let clubAndProfileFromState = [];
      for (let i = 0; i < tennisClubsFromState.length; i++) {
        let profile = await ClubProfile.findOne({
          tennisClub: tennisClubsFromState[i]._id
        });
        clubAndProfileFromState.push({
          club: tennisClubsFromState[i],
          profile
        });
      }
      if (clubAndProfileFromState.length > 0) {
        user.locationState = req.body.state;
        user.locationTown = req.body.city;
        user.locationSaved = true;
        user.locationDenied = false;
        user.save();
        res.status(200).json({ clubsBack: clubAndProfileFromState });
      }
    } else {
      res.status(404).json({
        error:
          "No Clubs found based on your location, please use the search bar."
      });
    }
  }
});

router.get("/clubsFromSavedLocation", authUser, async (req, res) => {
  let user = await User.findOne({ _id: req.user.id });
  let tennisClubsFromCity = await TennisClub.find({ city: user.locationTown });
  if (tennisClubsFromCity.length > 0) {
    let clubsAndProfilesToSendBack = [];
    for (let i = 0; i < tennisClubsFromCity.length; i++) {
      let profile = ClubProfile.findOne({ tennisClub: tennisClubsFromCity[i] });
      if (profile) {
        clubsAndProfilesToSendBack.push({
          club: tennisClubsFromCity[i],
          profile
        });
      }
    }
    return res
      .status(200)
      .json({ clubsFromLocation: clubsAndProfilesToSendBack });
  } else {
    let tennisClubFromState = await TennisClub.find({
      state: user.locationState
    });
    let clubsAndProfileFromState = [];
    if (tennisClubFromState.length > 0) {
      for (let z = 0; z < tennisClubFromState.length; z++) {
        let profileFromState = await ClubProfile.findOne({
          tennisClub: tennisClubFromState[z]._id
        });

        if (profileFromState) {
          clubsAndProfileFromState.push({
            club: tennisClubFromState[z],
            profile: profileFromState
          });
        }
      }
    }

    return res
      .status(200)
      .json({ clubsFromLocation: clubsAndProfileFromState });
  }
});

router.post("/clubSearch", authUser, async (req, res) => {
  // state
  // zip
  // city
  // state zip
  // state city
  // state zip city
  // city zip
  if (req.body.state !== "" && req.body.zip === "" && req.body.city === "") {
    let tennisClubsByState = await TennisClub.find({ state: req.body.state });
    if (tennisClubsByState.length > 0) {
      let clubAndProfileState = [];
      for (let i = 0; i < tennisClubsByState.length; i++) {
        let clubProfileFound = await ClubProfile.findOne({
          tennisClub: tennisClubsByState[i]._id
        });
        if (clubProfileFound) {
          clubAndProfileState.push({
            club: tennisClubsByState[i],
            profile: clubProfileFound
          });
        }
      }
      return res.json({ tennisClubsBack: clubAndProfileState });
    } else {
      return res
        .status(406)
        .json({ message: "Your search did not return any results." });
    }
  } else if (
    req.body.state === "" &&
    req.body.zip !== "" &&
    req.body.city === ""
  ) {
    let tennisClubsByZip = await TennisClub.find({ zip: req.body.zip });
    if (tennisClubsByZip.length > 0) {
      let clubsAndProfileZip = [];
      for (let i = 0; i < tennisClubsByZip.length; i++) {
        let clubProfileFound = await ClubProfile.findOne({
          tennisClub: tennisClubsByZip[i]._id
        });
        if (clubProfileFound) {
          clubsAndProfileZip.push({
            club: tennisClubsByZip[i],
            profile: clubProfileFound
          });
        }
      }
      return res.json({ tennisClubsBack: clubsAndProfileZip });
    } else {
      return res
        .status(406)
        .json({ message: "Your search did not return any results." });
    }
  } else if (
    req.body.state === "" &&
    req.body.zip === "" &&
    req.body.city !== ""
  ) {
    let tennisClubsByCity = await TennisClub.find({ city: req.body.city });
    if (tennisClubsByCity.length > 0) {
      let clubAndProfileCity = [];
      for (let i = 0; i < tennisClubsByCity.length; i++) {
        let profileFound = await ClubProfile.findOne({
          tennisClub: tennisClubsByCity[i]._id
        });
        if (profileFound) {
          clubAndProfileCity.push({
            club: tennisClubsByCity[i],
            profile: profileFound
          });
        }
      }
      return res.json({ tennisClubsBack: clubAndProfileCity });
    } else {
      let allClubs = await TennisClub.find({});
      let clubsThatMatchCity = [];
      for (let i = 0; i < allClubs.length; i++) {
        if (allClubs[i].city.includes(req.body.city)) {
          clubsThatMatchCity.push(allClubs[i]);
        }
      }
      if (clubsThatMatchCity.length > 0) {
        let clubsAndProfile = [];
        for (let z = 0; z < clubsThatMatchCity.length; z++) {
          let clubProfileFound = await ClubProfile.findOne({
            tennisClub: clubsThatMatchCity[z]._id
          });
          if (clubProfileFound) {
            clubsAndProfile.push({
              club: clubsThatMatchCity[z],
              profile: clubProfileFound
            });
          }
        }
        if (clubsAndProfile.length > 0) {
          return res.status(200).json({ tennisClubsBack: clubsAndProfile });
        }
      } else {
        return res
          .status(406)
          .json({ message: "Your search did not return any results." });
      }
    }
  } else if (
    req.body.state !== "" &&
    req.body.zip !== "" &&
    req.body.city === ""
  ) {
    let tennisClubsFromStateAndZip = await TennisClub.find({
      state: req.body.state,
      zip: req.body.zip
    });
    if (tennisClubsFromStateAndZip.length > 0) {
      let clubAndProfileFromStateAndZip = [];
      for (let i = 0; i < tennisClubsFromStateAndZip.length; i++) {
        let profileFromStateAndZip = await ClubProfile.findOne({
          tennisClub: tennisClubsFromStateAndZip[i]._id
        });
        if (profileFromStateAndZip) {
          clubAndProfileFromStateAndZip.push({
            club: tennisClubsFromStateAndZip[i],
            profile: profileFromStateAndZip
          });
        }
      }
      if (clubAndProfileFromStateAndZip.length > 0) {
        return res
          .status(200)
          .json({ tennisClubsBack: clubAndProfileFromStateAndZip });
      }
    } else {
      return res
        .status(406)
        .json({ message: "Your search did not return any results." });
    }
  } else if (
    req.body.state !== "" &&
    req.body.zip === "" &&
    req.body.city !== ""
  ) {
    let tennisClubsFromStateAndCity = await TennisClub.find({
      state: req.body.state,
      city: req.body.city
    });
    if (tennisClubsFromStateAndCity.length > 0) {
      let clubAndProfileFromStateAndCity = [];
      for (let i = 0; i < tennisClubsFromStateAndCity.length; i++) {
        let profileFromStateAndCity = await ClubProfile.findOne({
          tennisClub: tennisClubsFromStateAndCity[i]
        });
        if (profileFromStateAndCity) {
          clubAndProfileFromStateAndCity.push({
            club: tennisClubsFromStateAndCity[i],
            profile: profileFromStateAndCity
          });
        }
      }
      if (clubAndProfileFromStateAndCity.length > 0) {
        return res
          .status(200)
          .json({ tennisClubsBack: clubAndProfileFromStateAndCity });
      }
    } else {
      return res
        .status(406)
        .json({ message: "Your search did not return any results." });
    }
  } else if (
    req.body.state !== "" &&
    req.body.zip !== "" &&
    req.body.city !== ""
  ) {
    let tennisClubsFromStateAndCityAndZip = await TennisClub.find({
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip
    });
    if (tennisClubsFromStateAndCityAndZip.length > 0) {
      let clubAndProfileFromStateAndCityAndZip = [];
      for (let i = 0; i < tennisClubsFromStateAndCityAndZip.length; i++) {
        let profileFromStateAndCityAndZip = await ClubProfile.findOne({
          tennisClub: tennisClubsFromStateAndCityAndZip[i]
        });
        if (profileFromStateAndCityAndZip) {
          clubAndProfileFromStateAndCityAndZip.push({
            club: tennisClubsFromStateAndCityAndZip[i],
            profile: profileFromStateAndCityAndZip
          });
        }
      }
      if (clubAndProfileFromStateAndCityAndZip.length > 0) {
        return res
          .status(200)
          .json({ tennisClubsBack: clubAndProfileFromStateAndCityAndZip });
      }
    } else {
      return res
        .status(406)
        .json({ message: "Your search did not return any results." });
    }
  } else if (
    req.body.state === "" &&
    req.body.zip !== "" &&
    req.body.city !== ""
  ) {
    let tennisClubsFromZipAndCity = await TennisClub.find({
      zip: req.body.zip,
      city: req.body.city
    });
    if (tennisClubsFromZipAndCity.length > 0) {
      let clubAndProfileFromZipAndCity = [];
      for (let i = 0; i < tennisClubsFromZipAndCity.length; i++) {
        let profileFromZipAndCity = await ClubProfile.findOne({
          tennisClub: tennisClubsFromZipAndCity[i]
        });
        if (profileFromZipAndCity) {
          clubAndProfileFromZipAndCity.push({
            club: tennisClubsFromZipAndCity[i],
            profile: profileFromZipAndCity
          });
        }
      }
      if (clubAndProfileFromZipAndCity.length > 0) {
        return res
          .status(200)
          .json({ tennisClubsBack: clubAndProfileFromZipAndCity });
      }
    } else {
      return res
        .status(406)
        .json({ message: "Your search did not return any results." });
    }
  } else {
    return res
      .status(406)
      .json({ message: "Your search did not return any results." });
  }
});

module.exports = router;
