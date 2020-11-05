const express = require('express');
const router = express.Router();
const ipModel = require('../models/ip');
const request = require('request');

const localIPs = ["::ffff:127.0.0.1", "::1"];

// Define the
router.post('/find', async function(req, res) {
    console.log('Check client IP address');

    let clientIPAddress = getClientIPAddress(req);
    //Simulate external IP
    clientIPAddress = '120.18.129.33';
    
    //Check if the IP address is local, and fetch IP details
    let ipDetails = await findIPLocation(clientIPAddress);
    
    if(!ipDetails.success || !ipDetails.data) return res.json({success: false});

    let ipRecord = new ipModel(Object.assign({}, ipDetails.data, {address: clientIPAddress}));

    ipModel.insertIP(ipRecord, (err, dbRes) => {
        if(err) res.json({success: false})
        res.json({success: true});
    });
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