import { ObjectID } from 'mongodb';

const mongoose = require('mongoose');

//Tracker schema
const AirfareSchema = mongoose.Schema({
    from: {type: String, required: true},
    to: {type: String, required: true},
    startDate: Date,
    endDate: Date,
    //Based on the 20 best prices
    minPrice: Number,
    maxPrice: Number,
    medianPrice: Number,
    averagePrice: Number,
    range: Number, //max-min
    nbResults: Number,
    source: String,
    trackerId: ObjectID
},{
    timestamps: true
});

export const Airfare = mongoose.model('Airfare', AirfareSchema);




