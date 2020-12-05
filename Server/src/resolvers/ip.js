//import IP from '../database/models/IP';
import { renameObjectKey } from '../services/helpers';
import { getClosestAirport, getMostITrackers } from '../services/geo';
import { Date } from './scalars';
const ipModel = require('../database/models/ip');

const request = require('request');


const localIPs = ["::ffff:127.0.0.1", "::1"];

module.exports = {
    Query: {
        
    },
    Mutation: {
        createIP: async (_, {},{clientIPAddress}) => {
            console.log('HERE', clientIPAddress);
            console.log('Check client IP address');

            //Simulate external IP
            clientIPAddress = '120.18.129.33';
            //Aalborg, DK: '77.68.202.109';
            //Brescia, IT: '79.48.159.82';
            //Washington State, US: '52.137.106.143';
            //Taipei: '210.208.255.205';
            //Sydney: '120.18.129.33';
            //Dallas: 107.131.103.142
            //Alexandria: 102.40.54.108
            //Jinan: 111.35.38.197
            //Torino: 46.233.156.79
            //Reserved IP: 250.133.201.118
    
            //Check if the IP address is local, and fetch IP details
            let ipDetails = await findIPLocation(clientIPAddress);
            if(!ipDetails.success || !ipDetails.data || ipDetails.data.status === 'fail') return {success: false};

            renameObjectKey(ipDetails.data, 'longitude', 'lon');
            renameObjectKey(ipDetails.data, 'latitude', 'lat');
            let ipRecord = new ipModel(Object.assign({}, ipDetails.data, {address: clientIPAddress}));

            let IPInserted = await ipModel.insertIP(ipRecord);

            if(!IPInserted) return {success: false};

            let closestAirport = await getClosestAirport(ipRecord);

            let mostITrackers = []; //await getMostITrackers(ipRecord);
            console.log(closestAirport);
            return {success: true, closestAirport, mostITrackers};
        }
    },
}


// Define the
/*
router.post('/find', async function(req, res) {
    
}); */

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

/*class IPFinder{
    constructor(){
        this.ipAddresses = [];
        this.localIPs = ["::ffff:127.0.0.1", "::1"];
    }

    async search(clientIPAddress, callback){
        //Search IP stored locally
        let cacheIP = this.cache(clientIPAddress);
        if(cacheIP) return cacheIP;

        //Purge existing ips
        this.purge();

        //Search IP from the API
        this.storePending(clientIPAddress, callback);
        let requestIP = await this.request(clientIPAddress);
        if(requestIP) return this.purge(clientIPAddress);

        //Store IP info
        this.store(requestIP);
    }

    storePending(clientIPAddress){
        this.ipAddresses.push({
            address: clientIPAddress,
            date: new Date(),
            status: 'pending',
            data: {},
            callbacks: [callback]
        });
    }

    setData(requestIP, clientIPAddress){
        let ip;
        for(let i = 0; i < this.ipAddresses.length; i++){
            if(this.ipAddresses[i].address === clientIPAddress){
                ip = this.ipAddresses[i];
                break;
            }
        }

        ip.status = 'received';
        ip.data = requestIP;
        //Call all the callbacks
        ip.callbacks.forEach((cb) => {cb(ip)});
    }

    cache(clientIPAddress){
        for(let i = 0; i < ips.length; i++){
            if(ips[i].address === clientIPAddress){
                return ips[i];
            }
        }

        return null;
    }

    request(clientIPAddress){
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

    purge(clientIPAddress){
        //Purge old stored ips
        for(let i = 0; i < this.ipAddresses.length; i++){
            if(this.ipAddresses[i].date < new Date()){
                
                i--;
            }
        }
    }

    isLocalIP(){
        return this.localIPs.indexOf(clientIPAddress)!== -1;
    }
}



let ips = [];
let ip = {
    address: '',
    status: 'pending' | 'received', //
    date: new Date(),
    data: {},
    callback: [] //Called when received
}
const searchIP = (ipClient) => {
    let cacheIP;
    

    
}
*/