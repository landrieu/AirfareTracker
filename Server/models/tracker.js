const mongoose = require('mongoose');

//Tracker schema
const trackerSchema = mongoose.Schema({
    from:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    startDates: {
        type: Array,
        required: true
    },
    endDates: {
        type: Array,
        required: true
    },
    isActive: {
        type: Boolean,
    },
    userId: String,
    isAlertEnabled: Boolean,
    triggerPrice: Number,
    alertEmail: String
},{
    timestamps: true
});

const Tracker = module.exports = mongoose.model('Tracker', trackerSchema);

module.exports.getTrackerById = function(id){
    return Tracker.findById(id);
}

module.exports.getUserByUserId = function(userId){
    const query = {userId}
    return User.findOne(query);
}

module.exports.getAllTrackers = function(){
    return Tracker.find();
}

module.exports.getNumberTrackers = function(){
    return Tracker.countDocuments();
}

module.exports.getActiveTrackers = function(){
    const query = {isActive: true};
    return Tracker.count(query);
}

module.exports.insertTraker = function(newTracker){
    return new Promise((resolve, reject) => {
        newTracker.save().then((savedTracker) => {
            resolve({success: true, savedTracker});
        }).catch((err) => {
            reject({success: false, message: err});
        });
    });   
}


module.exports.updateTracker = function(tracker, trackerId){
    User.update({"_id": trackerId}, tracker); 
}
