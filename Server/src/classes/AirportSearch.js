import { Airport } from '../database/models/Airport';

export class AirportSearch{
    /**
     * Status
     * 0 - Init
     * 1 - Loading
     * 2 - Complete
     * @param {*} param0 
     */
    constructor({filter = {}, updateTimeGap = 24 * 3600} = {}){
        this.airports = [];
        this.airportsMap = new Map();
        this.filter = filter;
        this.updatedAt = null;
        this.updateTimeGap = updateTimeGap;

        this.status = 0;
        this.resolvers = new Set();

        this.update();
    }

    /**
     * Update the status to 'pending', fetch airports from the database
     * Set the data then update status to 'complete'
     */
    update(){
        return new Promise(async(resolve) => {
            this.updateStatus(1);

            let airports = (await Airport.find(this.filter)).map(airport => airport._doc);
            this.updatedAt = new Date();

            this.updateAirports(airports);
            this.updateStatus(2);
            resolve();
        });
    }

    /**
     * Update status and last update date
     * @param {*} statusLevel 
     */
    updateStatus(statusLevel){
        this.status = statusLevel;
    }

    /**
     * Set airport to the data then dispatch the data
     * @param {Array} data Contains airports objects
     */
    updateAirports(data){
        this.airports = data;
        data.forEach((airport) => {
            this.airportsMap.set(airport.iataCode, airport);
        });
        console.log('Airports loaded!');
        this.dispatch();
    }

    /**
     * Add a new subscriber
     * @param {Function} resolver 
     */
    subscribe(resolver){
        this.resolvers.add(resolver);
    }


    /**
     * Call all the subscribers regitered
     */
    dispatch(){
        for(let resolver of this.resolvers){
            resolver(this.airports);
        }
        this.purgeResolvers();
    }

    purgeResolvers(){
        this.resolvers.clear();
    }

    /**
     * Check status, if 1, a request is pending, so subscribe to the feed
     * If no airport stored or last update too old, update the airport data
     * Then return the data
     */
    fetch(){
        return new Promise(async (resolve) => {
            //If updating data, subscribe to the feed
            if(this.status === 1){
                this.subscribe(resolve);
                return;
            }

            if(this.airports.length === 0 ||
              ((new Date() - this.updatedAt) /1000) > this.updateTimeGap){
                await this.update();
            }
            
            resolve(this.airports);
        });
    }

    getAirport(iataCode){
        return this.airportsMap.get(iataCode);
    }

    purge(){
        this.airports = [];
        this.airportsMap.clear();
    }

    dataLoaded(){
        return this.airportsMap.size > 0;
    }
}