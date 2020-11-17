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
    isActive: {
        type: Boolean,
        required: true
    },
    startDates: {
        type: Array,
        required: () => this.type === 'N'
    },
    endDates:  {
        type: Array,
        required: () => this.type === 'N'
    },

    /**
     * N - Normal, trackers created by users
     * F - Frequent routes - Can only be created by an ADMIN
     */
    type: String,
    //If type is F, must define patterns
    patterns: {
        type: Array,
        required: () => this.type === 'F'
    },
    isAlertActive: Boolean,
    //If the user is not registered, alert is send to the user email
    userEmail: {
        type: String,
        required: () => !this.userId
    },
    userId: String,
    triggerPrice: Number,
},{
    timestamps: true
});

export const Tracker = mongoose.model('Tracker', trackerSchema);




