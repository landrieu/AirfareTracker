//import IP from '../database/models/IP';
import { renameObjectKey } from '../services/helpers/object';
import { findClosestTrackers, findClosestAirport } from '../services/helpers/geo';
import { randomTrackers } from '../services/data/tracker';

import { IPFinder } from '../classes/IPFinder'; 


import {IP} from '../database/models/IP';
const request = require('request');

const localIPs = ["::ffff:127.0.0.1", "::1"];
const worldIPs = {
    /*Aalborg, DK*/         Aalborg: '77.68.202.109',
    /*Brescia, IT*/         Brescia: '79.48.159.82',
    /*Washington State, US*/Washington: '52.137.106.143',
    /*Taipei*/              Taipei: '210.208.255.205',
    /*Sydney*/              Sydney: '120.18.129.33',
    /*Dallas*/              Dallas: '107.131.103.142',
    /*Alexandria*/          Alexandria: '102.40.54.108',
    /*Jinan*/               Jinan: '111.35.38.197',
    /*Torino*/              Torino: '46.233.156.79',
    /*Reserved IP*/         Reserved: '250.133.201.118',
};

module.exports = {
    Query: {
            
    },
    Mutation: {
        findIPData: async (_, {},{clientIPAddress}) => {
            console.log(`Check client IP address ${clientIPAddress}`);

            //Simulate external IP
            //clientIPAddress = worldIPs.Dallas;
    
            //Check if the IP address is local, and fetch IP details
            let ipDetails = await findIPLocation(clientIPAddress);
            if(!ipDetails.success || !ipDetails.data || ipDetails.data.status === 'fail'){
                return {
                    success: false, 
                    closestAirport: null, 
                    closestTrackers: randomTrackers(6)
                };
            } 

            renameObjectKey(ipDetails.data, 'longitude', 'lon');
            renameObjectKey(ipDetails.data, 'latitude', 'lat');
            let ipRecord = new IP(Object.assign({}, ipDetails.data, {address: clientIPAddress}));

            console.time("Start scanning");
            let [closestAirport, closestTrackers] = await Promise.all(
                [findClosestAirport(ipRecord), findClosestTrackers(ipRecord, 6)]
            );
            console.timeEnd("Start scanning");
            //Save IP - Don't wait for the response
            ipModel.insertIP(ipRecord);
            //let IPInserted = await ipModel.insertIP(ipRecord);
            //if(!IPInserted) return {success: false};
            
            return {success: true, closestAirport, closestTrackers};
        },

        findIP: async (_, {},{clientIPAddress}) => {
            return new Promise(resolver => {
                ipFinder.search(clientIPAddress, resolver);
            });
        },

        findIPAirport: (_, {},{clientIPAddress}) => {
            return new Promise(resolver => {
                const findAirport = async ({success, data}) => {
                    if(!success) return resolver({success});

                    let airport = await findClosestAirport(data);
                    resolver({success: true, airport});
                }
                ipFinder.search(clientIPAddress, findAirport);
            });
        },

        findIPTrackers: (_, {},{clientIPAddress}) => {
            return new Promise(resolver => {
                const findTrackers = async ({success, data}) => {
                    if(!success){
                        //Return random trackers
                        return resolver({success: true, trackers: (await randomTrackers(6)).map(tracker => ({id: tracker._id, ...tracker}))});
                    } 
                    
                    let trackers = await findClosestTrackers(data, 6);
                    resolver({success: true, trackers});
                }

                ipFinder.search(clientIPAddress, findTrackers);
            });
        }
    },
}

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


let ipFinder = new IPFinder();
