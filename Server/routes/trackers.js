const express = require('express');
const router = express.Router();
const trackerModel = require('../models/tracker');

// Middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  //console.log('Time: ', Date.now());
  next();
});

//Register
router.post('/', async (req, res) => {
    //Create the new tracker and insert it into the Db
    let newTracker = new trackerModel({
        from: req.body.from,
        to: req.body.to,
        startDates: [new Date(), new Date()],
        endDates: [new Date(), new Date()],
        isActive: true,
        userId: "465zefef6feaz"
    });

    let insertion = await trackerModel.insertTraker(newTracker);
    if(!insertion.success){
        res.json({ success: false, message: "Failed to register the tracker"});
    }else{
        res.json({ success: true, message: "Tracker registered"});
    }
});

// Define the home page route
router.get('/', function(req, res) {
  //Retrieve all trackers
  trackerModel.getAllTrackers().then((trackers) => {
    console.log(trackers);
    res.json({success: true, trackers});
  }).catch((err) => {
    res.json({success: false, message: err});
  });
});

router.get('/:id', function(req, res) {
  //Retrieve a specific tracker
  var trackerId = req.params.id;
  res.json({message: 'Users home page', id: trackerId});
})

module.exports = router;