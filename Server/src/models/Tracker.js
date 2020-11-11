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

export const Tracker = mongoose.model('Tracker', trackerSchema);




