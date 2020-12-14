//import IP from '../database/models/IP';
import { renameObjectKey } from '../services/helpers/object';
import { findClosestTrackers, findClosestAirport } from '../services/helpers/geo';
import { randomTrackers } from '../services/data/tracker';

const ipModel = require('../database/models/ip');
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
}

module.exports = {
    Query: {
            
    },
    Mutation: {
        findIPData: async (_, {},{clientIPAddress}) => {
            console.log('HERE', clientIPAddress);
            console.log('Check client IP address');

            //Simulate external IP
            clientIPAddress = worldIPs.Dallas;
    
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
            let ipRecord = new ipModel(Object.assign({}, ipDetails.data, {address: clientIPAddress}));

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
                    if(!success) return resolver({success});
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

class IPFinder{
    constructor(purgeTime = (1000 * 60 * 60 /*1hr*/)){
        this.addresses = new Map();
        this.localIPs = ["::ffff:127.0.0.1", "::1"];
        this.purgeTime = purgeTime;
    }

    async search(clientIPAddress, subscriber){
        let p = ['Brescia', 'Washington', 'Taipei', 'Sydney', 'Dallas'];
        clientIPAddress = worldIPs[p[Math.floor(Math.random() * p.length)]];

        //Purge existing ips
        this.purge();

        //Search IP stored locally
        let {cacheIP, pendingIP} = this.checkCache(clientIPAddress, subscriber);
        console.log(!!cacheIP);
        //Return the cache IP data
        if(cacheIP) return subscriber({success: cacheIP.success, data: cacheIP.data});
        //Wait for request to be received
        if(pendingIP)  return;

        //Search IP from the API
        this.storePendingIP(clientIPAddress, subscriber);

        let ipDetails = await this.request(clientIPAddress);

        if(!ipDetails.success || !ipDetails.data || ipDetails.data.status === 'fail'){
            return this.updatePendingIP(clientIPAddress, false, null)
        } 

        //Store IP info
        this.updatePendingIP(clientIPAddress, true, ipDetails);
    }

    updatePendingIP(address, success, ipDetails){
        this.addresses.get(address).updateData(success, ipDetails ? ipDetails.data : null);
    }

    storePendingIP(address, callback){
        let ip = new IP(address, callback);
        this.addresses.set(address, ip);
    }

    subscribe(address, subscriber){
        if(this.addresses.has(address)){
            this.addresses.get(address).subscribe(subscriber);
            return true;
        }

        return false;
    }

    checkCache(address, subscriber){
        let ip = this.fetchIP(address);
        if(!ip) return {cacheIP: null, pendingIP: false} ;

        if(ip.status === 'received') return {cacheIP: ip, pendingIP: false};

        ip.subscribe(subscriber);
        return {cacheIP: null, pendingIP: true};
    }

    fetchIP(address){
        if(this.addresses.has(address)) 
        return this.addresses.get(address);

        return null;
    }

    request(clientIPAddress){
        return new Promise((resolve) => {
            if(isLocalIP(clientIPAddress)){
                return resolve({success: false, origin: 'intern'});
            }
    
            const url = `http://ip-api.com/json/${clientIPAddress}`;
    
            request.get(url, {json: true}, (err, res, body) => {
                if(err) return resolve({success: false, origin: 'extern'});
 
                /*await new Promise((resolveT) => {
                    setTimeout(() => {resolveT()}, 2000);
                });*/
                
                let ipInfo = {...body, address: clientIPAddress};
                renameObjectKey(ipInfo, 'longitude', 'lon');
                renameObjectKey(ipInfo, 'latitude', 'lat');
                return resolve({success: true, origin: 'extern', data: ipInfo});
            });
        });
    }

    purge(address){
        if(address) return this.addresses.delete(address);
        //Purge old stored ips
        for (const [key, value] of this.addresses.entries()) {
            if(new Date() - new Date(value.date) > this.purgeTime){
                this.addresses.delete(key);
            }
        }
    }

    isLocalIP(address){
        return this.localIPs.indexOf(address)!== -1;
    }
}

class IP{
    constructor(address, subscriber){
        this.address = address;
        this.subscribers = new Set(subscriber ? [subscriber] : []);
        //this.subscribers = subscriber ? [subscriber] : [];
        this.data = null;
        this.date = new Date();
        this.status = 'pending';
        this.success = null;
    }
    
    updateData(success, data = {}){
        this.success = success;
        this.data = data;
        this.status = 'received';
        this.success = success;

        this.dispatch();

        this.purge();
    }

    dispatch(){
        for(let subscriber of this.subscribers){
            subscriber({success: this.success, data: this.data});
        }
    }

    purge(){
        this.subscribers.clear();
    }

    subscribe(subscriber){
        this.subscribers.add(subscriber);
    }
}

let ipFinder = new IPFinder();
