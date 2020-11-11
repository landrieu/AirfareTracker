import { ObjectID } from 'mongodb';

const mongoose = require('mongoose');

//Tracker schema
const AirfareSchema = mongoose.Schema({
    from: {type: String, required: true},
    to: {type: String, required: true},
    startDate: Date,
    endDate: Date,
    minPrice: Number,
    //Based on the 20 best prices
    medianPrice: Number,
    averagePrice: Number,
    trackerId: ObjectID
},{
    timestamps: true
});

export const Airfare = mongoose.model('Airfare', AirfareSchema);




