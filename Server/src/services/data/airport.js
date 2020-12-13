//const FlexSearch = require("@talaikis/flexsearch");
import FlexSearch from '@talaikis/flexsearch';
import { Airport } from '../../database/models/Airport';

import { AIRPORT_TYPES } from '../constants';

let airportSearch;

class AirportSearch{
    /**
     * Status
     * 0 - Init
     * 1 - Loading
     * 2 - Complete
     * @param {*} param0 
     */
    constructor({filter = {}, updateTimeGap = 24 * 3600} = {}){
        this.airports = [];
        this.filter = filter;
        this.updatedAt = null;
        this.updateTimeGap = updateTimeGap;

        this.status = 0;
        this.resolvers = [];

        //this.update();
    }

    update(){
        return new Promise(async(resolve) => {
            this.updateStatus(1);
            this.updatedAt = new Date();
            let airports = await Airport.find(this.filter);

            this.updateResource('airports', airports);
            this.updateStatus(2);
            resolve();
        });
    }

    updateStatus(statusLevel){
        this.status = statusLevel;
    }

    updateResource(resource, data){
        this[resource] = data;
        this.call(resource);
    }

    subscribe(resolver, resource){
        this.resolvers.push({resource, fc: resolver});
    }

    call(resource){
        for(let i = 0; i < this.resolvers.length; i++){
            if(this.resolvers[i].resource === resource){
                let res = this.resolvers.splice(i, 1)[0];
                res.fc(this[res.resource]);
                i--;
            }
        }
    }

    fetch(){
        return new Promise(async (resolve) => {
            //If updating data, subscribe to the feed
            if(this.status === 1){
                this.subscribe(resolve, 'airports');
                return;
            }

            if(this.airports.length === 0 ||
              ((new Date() - this.updatedAt) /1000) > this.updateTimeGap){
                await this.update();
            }
            
            resolve(this.airports);
        });
    }

    purge(){
        this.airports = [];
    }
}

initializeAirportSearch();

/**
 * Return only medium or large airports, and with a iata code
 * @param {Object} param0 
 * @param {Number} numberAirports 
 */
export const closestAirports = async ({longitude, latitude}, numberAirports, filter) => {
	return Airport.find(
		{ $and: [
			{$or: [{type: 'medium_airport'}, {type: 'large_airport'}, {type: 'multi_airport'}]}, 
			filter,
			/*{iataCode:{$ne: ''}},*/
			{
				coordinates: {
					$nearSphere: {
						$geometry: {coordinates: [Number(longitude), Number(latitude)]}, 
					}
				}
			}
		]}
	).limit(numberAirports);
}

function initializeAirportSearch(){
    let filter = {$and: 
        [
            {$or: [{type: 'medium_airport'}, {type: 'large_airport'}, {type: 'multi_airport'}]}, 
            {iataCode:{$ne: ''}}
        ]
    };
    airportSearch = new AirportSearch({filter});
}

export const airportsBySearchTerm = (searchTerm, limit = 6) => {
    if(!airportSearch) initializeAirportSearch();

    return new Promise(async (resolve) => {
        let index = new FlexSearch({
            doc: {
                id: "id",
                field: [
                    "city",
                    "name",
                    "iataCode",
                    "country"
                ]
            }
        });
    
        let airports = await airportSearch.fetch();
    
        index.add(airports);
    
        console.time('Flex search');
        //const airportTypes = ['medium_airport', 'large_airport', 'multi_airport'];
        let res = index.search({
            query: searchTerm,
            limit: 100,
            threshold: 5, // >= threshold
            depth: 3,
            sort: (a, b) => {
                //if(airportTypes.indexOf(b.type) !== airportTypes.indexOf(a.type)){
                    return AIRPORT_TYPES.indexOf(b.type) - AIRPORT_TYPES.indexOf(a.type)
                //}
            }
        });
        console.timeEnd('Flex search');
        resolve(res.slice(0, limit));
    });
};

export const airportsWithFilter = (query, fields) =>{
    return Airport.find(query, fields);
}

/**
 * Deprecated, full match search
 * @param {*} searchTerm 
 * @param {*} limitRes 
 */
export const airportsBySearchTermMongo = async (searchTerm, limitRes = 6) => {
    console.log(searchTerm)
    return Airport.find(
        {$and: [
            {$or: [{type: 'medium_airport'}, {type: 'large_airport'}, {type: 'multi_airport'}]},
            { $text: {$search: searchTerm, $caseSensitive: false}},
        ]}
    ).limit(limitRes);
};