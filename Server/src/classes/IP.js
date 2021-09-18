import moment from 'moment';

/**
 * IP Object
 */
export class IP{
    /**
     * 
     * @param {String} address IP address
     * @param {Function} subscriber Callback function, executed when info are received
     */
    constructor(address, subscriber){
        this.address = address;
        this.subscribers = new Set(subscriber ? [subscriber] : []);
        this.data = null;
        this.date = new Date();
        this.status = 'pending';
        this.success = null;
    }
    
    /**
     * Update IP info, then call the subscribers
     * @param {Boolean} success 
     * @param {Object} data 
     */
    updateData(success, data = {}){
        this.success = success;
        this.data = data;
        this.status = 'received';
        this.success = success;

        this.dispatch();

        this.purge();

        this.display();
    }

    display(){
        console.log(`Date: ${moment().format('DD/MM/YYYY HH:mm:ss')}`);
        console.log(`IP address: ${this.address}  ${this.data ? `${this.data.city} - ${this.data.country}` : ''}`);
    }

    save(IPModel){
        let newIP = new IPModel(this.data);
        return newIP.save();
    }

    /**
     * Call the subscribers
     */
    dispatch(){
        for(let subscriber of this.subscribers){
            subscriber({success: this.success, data: this.data});
        }
    }

    /**
     * Purge the subscribers
     */
    purge(){
        this.subscribers.clear();
    }

    /**
     * Subscribe, attach callback function
     * @param {Function} subscriber 
     */
    subscribe(subscriber){
        this.subscribers.add(subscriber);
    }
}