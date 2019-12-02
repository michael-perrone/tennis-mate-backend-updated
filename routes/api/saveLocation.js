const express = require('express');
const router = express.Router();
const User = require('../../models/User');


router.post('/', async(req,res) => {
    if(req.body.user) {
        try {
            console.log(req.body.locationSaved, 'hi')
        let user = await User.findOneAndUpdate(
            {_id: req.body.user.user.id}, 
            {$set: {locationSaved: req.body.locationSaved,
                 locationTown: req.body.townLocation,
                  locationState: req.body.stateLocation,
                locationDenied: req.body.locationDenied}},
             {new: true}); 
       if (user.locationSaved) {    
          return res.status(200).json({success: "Your location has been saved"})
       }
       if (user && user.locationSaved === false) {
          return res.status(200).json({notSaved: "Your location will not be saved, and you will not be asked again. If you change your mind you can set your location in profile settings."})
       }
       if (!user) {
         return  res.status(404).json({weird: "Dont know what to write here yet"})
       }
    }
    catch(error) {
        console.log(error)
     }
}
})

module.exports = router;