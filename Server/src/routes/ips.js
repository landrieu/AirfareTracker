const express = require('express');
const router = express.Router();
const ipModel = require('../database/models/ip');
const request = require('request');

import {renameObjectKey} from '../services/helpers/object';
import {findClosestAirport} from '../services/helpers/geo';

const localIPs = ["::ffff:127.0.0.1", "::1"];

// Define the
router.post('/find', async function(req, res) {
    console.log('Check client IP address');

    let clientIPAddress = getClientIPAddress(req);
    //Simulate external IP
    clientIPAddress = '120.18.129.33';
    //Aalborg, DK: '77.68.202.109';
    //Brescia, IT: '79.48.159.82';
    //Washington State, US: '52.137.106.143';
    //Taipei: '210.208.255.205';
    //Sydney: '120.18.129.33';
    
    //Check if the IP address is local, and fetch IP details
    let ipDetails = await findIPLocation(clientIPAddress);
    
    if(!ipDetails.success || !ipDetails.data) return res.json({success: false});

    renameObjectKey(ipDetails.data, 'longitude', 'lon');
    renameObjectKey(ipDetails.data, 'latitude', 'lat');
    let ipRecord = new ipModel(Object.assign({}, ipDetails.data, {address: clientIPAddress}));

    let IPInserted = await ipModel.insertIP(ipRecord);

    if(!IPInserted) return res.json({success: false});

    let closestAirport = await findClosestAirport(ipRecord);
    console.log(closestAirport);
    res.json({success: true, closestAirport});
}); 

/**
 * Find IP address location, first check is internal. If no, a call to API is made to retrieve information
 * @param {String} clientIPAddress Client IP address
 */
function findIPLocation(clientIPAddress){
    return new Promise((resolve, reject) => {
        if(isLocalIP(clientIPAddress)){
            return resolve({success: false, origin: 'intern'});
        }

        const url = `http://ip-api.com/json/${clientIPAddress}`;

        request.get(url, {json: true}, (err, res, body) => {
            if(err) return resolve({success: false, origin: 'extern'});
            
            return resolve({success: true, origin: 'extern', data: body});
        });
    });
}

function isLocalIP(clientIPAddress){
    return localIPs.indexOf(clientIPAddress)!== -1;
}

/**
 * Get the IP address from the client request
 * @param {Object} req 
 */
function getClientIPAddress(req){
    return (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        req.connection.socket.remoteAddress;
}

module.exports = router;