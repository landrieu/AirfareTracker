const mongoose = require('mongoose');

//Tracker schema
const AirportSchema = mongoose.Schema({
    identification: String,
    name: { type: String, text: true },
    iataCode: { type: String, text: true },
    type: String,
    city: { type: String, text: true },
    region: String,
    country: String,
    continent: String,
    latitude: Number,
    longitude: Number,
    localCode: String,
    gpsCode: String,
    elevation: Number,
    isSingleAirport: Boolean,
    coordinates: Array
},{
    timestamps: true
});

export const Airport = mongoose.model('Airport', AirportSchema);




