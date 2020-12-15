//const FlexSearch = require("@talaikis/flexsearch");
import FlexSearch from '@talaikis/flexsearch';
import { Airport } from '../../database/models/Airport';
import { AirportSearch } from '../../classes/AirportSearch';

import { computeGeoDistance } from '../helpers/geo';

import { AIRPORT_TYPES } from '../constants';

/**
 * Return only medium or large airports, and with a iata code
 * @param {Object} param0 
 * @param {Number} numberAirports 
 */
export const closestAirportsFromDb = async ({longitude, latitude}, numberAirports, filter) => {
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

export const closestAirports = async ({longitude, latitude}, numberAirports, airportsTracker) =>{
    //If the aiports have not been loaded yet, check closest airports directly in the database
    if(!airportSearch.dataLoaded()){
        let filter = {iataCode: {$in: airportsTracker}};
        return closestAirportsFromDb({longitude, latitude}, numberAirports, filter);
    } 

    return airportsTracker
    .map(iataCode => airportSearch.getAirport(iataCode))
    .sort((a, b) => (computeGeoDistance(latitude, longitude, a.latitude, a.longitude) - computeGeoDistance(latitude, longitude, b.latitude, b.longitude)))
    .slice(0, numberAirports);
}

export function initializeAirportSearch(){
    /*let filter = {$and: 
        [
            {$or: [{type: 'medium_airport'}, {type: 'large_airport'}, {type: 'multi_airport'}]}, 
            {iataCode:{$ne: ''}}
        ]
    };
    airportSearch = new AirportSearch({filter});*/
    airportSearch.fetch();
}

export const airportsBySearchTerm = (searchTerm, limit = 6) => {
    if(!airportSearch) initializeAirportSearch();

    return new Promise(async (resolve) => {
        let index = new FlexSearch({
            doc: {
                id: "id",
                field: ["city", "name", "iataCode", "country"]
            }
        });
    
        let airports = await airportSearch.fetch();
    
        index.add(airports);
    
        console.time('Flex search');
        let res = index.search({
            query: searchTerm,
            limit: 100,
            threshold: 5, // >= threshold
            depth: 3,
            sort: (a, b) => AIRPORT_TYPES.indexOf(b.type) - AIRPORT_TYPES.indexOf(a.type)
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

let filterAirportSearch = {$and: 
    [
        {$or: [{type: 'medium_airport'}, {type: 'large_airport'}, {type: 'multi_airport'}]}, 
        {iataCode:{$ne: ''}}
    ]
};
export let airportSearch = new AirportSearch({filterAirportSearch});