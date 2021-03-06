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
        required: function(){return (this.type === 'N')}
    },
    endDates:  {
        type: Array,
        required: function(){return (this.type === 'N')}
    },

    /**
     * N - Normal, trackers created by users
     * F - Frequent routes - Can only be created by an ADMIN
     */
    type: String,
    //If type is F
    occurrences: Array,
    //Array of sources' ids
    sources: Array,
    isAlertActive: Boolean,
    //If the user is not registered, alert is send to the user email
    userEmail: {
        type: String,
        required: function(){return this.type === 'N' && !this.userId}
    },
    userId: {
        type: String,
        required: function(){return this.type === 'N' && !this.userEmail} 
    },
    triggerPrice: Number,
},{
    timestamps: true
});

export const Tracker = mongoose.model('Tracker', trackerSchema);




