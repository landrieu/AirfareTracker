import { Airport } from '../database/models/Airport';
import { Exporter } from './Exporter';

let defaultFilter = {$and: 
    [
        {$or: [{type: 'medium_airport'}, {type: 'large_airport'}, {type: 'multi_airport'}]}, 
        {iataCode:{$ne: ''}}
    ]
};

export class AirportSearch{
    /**
     * Status
     * 0 - Init
     * 1 - Loading
     * 2 - Complete
     * @param {Object} param contains the settings used to handle airport data management
     */
    
    constructor({filter = defaultFilter, updateTimeGap = 24 * 3600, localStorage = {useLocalData: true}} = {}){
        this.airports = [];
        this.airportsMap = new Map();
        this.filter = filter;
        this.updatedAt = null;
        this.updateTimeGap = updateTimeGap;

        this.status = 0;
        this.resolvers = new Set();

        this.useLocalData = localStorage.useLocalData;
        this.localDataValidityTime = localStorage.localDataValidityTime || 24 * 60 * 60 * 1000; //1 day
        this.exporter = null;
        //this.initLocalData();
        //this.update();
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

            this.updateAirports(airports, true);
            this.updateStatus(2);
            resolve();
        });
    }

    /**
     * 
     */
    async initialize(){
        if(this.useLocalData){
            this.exporter = new Exporter('airports', 'DATA', `/data`, null);

            let localData = await this.exporter.read();

            if(!localData || !localData.date) return this.fetch();

            if(new Date - new Date(localData.date) > this.localDataValidityTime) return this.fetch();
            this.updatedAt = new Date();
            this.updateAirports(localData.airports, false);

        }else{
            this.fetch();
        }
    }

    /**
     * Update status and last update date
     * @param {String} statusLevel 
     */
    updateStatus(statusLevel){
        this.status = statusLevel;
    }

    /**
     * Export local data
     * @param {Array} airports 
     */
    updateLocalData(airports){
        let localData = {
            date: new Date(),
            airports
        }
        this.exporter.run({data: JSON.stringify(localData)})
    }

    /**
     * Set airport to the data then dispatch the data
     * @param {Array} data Contains airports objects
     */
    updateAirports(airports, fromDatabase){
        this.airports = airports;
        airports.forEach((airport) => {
            this.airportsMap.set(airport.iataCode, airport);
        });

        if(this.useLocalData && fromDatabase){
            this.updateLocalData(airports);
        }

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

    /**
     * Purge the subscribers
     */
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

    /**
     * Return a specific airport via the iata code
     * @param {String} iataCode 
     */
    getAirport(iataCode){
        return this.airportsMap.get(iataCode);
    }

    /**
     * Purger all the stored airports
     */
    purge(){
        this.airports = [];
        this.airportsMap.clear();
    }

    /**
     * Check if the store is empty
     */
    dataLoaded(){
        return this.airportsMap.size > 0;
    }
}