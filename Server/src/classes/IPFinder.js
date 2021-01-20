import { IP } from './IP';
import { renameObjectKey } from '../services/helpers/object';

const request = require('request');

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

export class IPFinder{
    constructor(purgeTime = (1000 * 60 * 60 /*1hr*/)){
        this.addresses = new Map();
        this.localIPs = ["::ffff:127.0.0.1", "::1"];
        this.purgeTime = purgeTime;

        //TEST
        //let p = ['Brescia', 'Washington', 'Taipei', 'Sydney', 'Dallas'];
        //this.clientIPAddressTEST = worldIPs[p[Math.floor(Math.random() * p.length)]];
    }

    async search(clientIPAddress, subscriber){
        
        //TEST
        //clientIPAddress = this.clientIPAddressTEST;

        //Purge existing ips
        this.purge();

        //Search IP stored locally
        let {cacheIP, pendingIP} = this.checkCache(clientIPAddress, subscriber);
        //console.log(!!cacheIP);
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
            if(this.isLocalIP(clientIPAddress)){
                return resolve({success: false, origin: 'intern'});
            }
    
            const url = `http://ip-api.com/json/${clientIPAddress}`;
    
            request.get(url, {json: true}, (err, res, body) => {
                if(err) return resolve({success: false, origin: 'extern'});
 
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