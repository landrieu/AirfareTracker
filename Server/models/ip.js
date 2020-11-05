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
    lat: String,
    lon: String,
    as: String
},{
    timestamps: true
});

const model = mongoose.model("ips", ipSchema);

module.exports = model;

module.exports.insertIP = function(IP, callback){
    IP.save(callback);
}