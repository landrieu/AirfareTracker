import {ObjectID} from 'mongodb';

const mongoose = require('mongoose');

//Tracker schema
const AirportSchema = mongoose.Schema({
    identification: String,
    name: String,
    iataCode: String,
    type: String,
    city: String,
    region: String,
    country: String,
    continent: String,
    latitude: Number,
    longitude: Number,
    localCode: String,
    gpsCode: String,
    elevation: Number,
    isSingleAirport: Boolean
},{
    timestamps: true
});

export const Airport = mongoose.model('Airport', AirportSchema);




