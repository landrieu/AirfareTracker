const mongoose = require('mongoose');

const ipSchema = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    country: String,
    countryCode: String,
    region: String,
    regionName: String,
    city: String,
    zip: String,
    latitude: String,
    longitude: String,
    as: String
},{
    timestamps: true
});

export const IP = mongoose.model("ips", ipSchema);