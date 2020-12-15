export class IP{
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