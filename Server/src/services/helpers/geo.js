import { listFrequentTrackersAirports, findTrackers } from '../data/tracker';
import { closestAirports, airportsWithFilter, closestAirportsFromDb } from '../data/airport';
import { isNullOrUndefined } from './misc';

import { NB_TRACKERS, EARTH_RADIUS } from '../constants';

/**
 * Compute the distance in km between two points
 * @param {Number} lat1 
 * @param {Number} lon1 
 * @param {Number} lat2 
 * @param {Number} lon2 
 */
export const computeGeoDistance = (lat1, lon1, lat2, lon2) => {
	if(isNullOrUndefined(lat1, lon1, lat2, lon2)) return null;

	let R = EARTH_RADIUS; 
	let dLat = deg2rad(lat2-lat1);  // deg2rad below
	let dLon = deg2rad(lon2-lon1); 
	let a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	let d = R * c; // Distance in km
	return d;
}

/**
 * Convert degrees to radian
 * @param {Number} deg 
 */
function deg2rad(deg) {
	return deg * (Math.PI/180)
}

/**
 * Find trackers that are the closest from the IP details
 * @param {Array} airports 
 * @param {Number} numberTrackers 
 */
export const findClosestTrackersAndSort = async(airports, numberTrackers) =>{
	let cTrackers = [];
	let query;
	const fields = {_id: 1, from: 1, to: 1};
	let trackersByID = new Map();
	for(let i = 0; i < airports.length; i++){
		query = {$and: [{type: 'F'},{$or: [{"from": airports[i]}, {"to": airports[i]}]}]}
		let trackersQueried  = await findTrackers(query, fields);
		
		for(let j = 0; j < trackersQueried.length; j++){
			if(!trackersByID.has(trackersQueried[j]._id.toString())){
				trackersByID.set(trackersQueried[j]._id.toString(), trackersQueried[j]);
			}
		}
		if(trackersByID.size >= numberTrackers) break;
	}

	cTrackers = [...trackersByID.values()];
	//Sort out, based on airports
	cTrackers.sort((a, b) => {
		let aScoreFrom = airports.indexOf(a.from) !== -1 ? airports.indexOf(a.from) : 100;
		let aScoreTo   = airports.indexOf(a.to) !== -1 ? airports.indexOf(a.to) : 100;
		let aScore = aScoreFrom + aScoreTo;

		let bScoreFrom = airports.indexOf(b.from) !== -1 ? airports.indexOf(b.from) : 100;
		let bScoreTo   = airports.indexOf(b.to) !== -1 ? airports.indexOf(b.to) : 100;
		let bScore = bScoreFrom + bScoreTo;
		return aScore - bScore;
	});

	return cTrackers;
};

//Get the most interesting trackers (closest airports from the user)
/**
 * Find the most interesting tracker for the user, based on is location
 * 1 - List all the airports from the frequent trackers
 * 2 - Sort the airports by distance with the user
 * 3 - Fetch the trackers associated to those close airports
 *  
 * @param {*} param0 
 * @param {*} numberTrackers 
 */
export const findClosestTrackers = async({longitude, latitude, city}, numberTrackers = NB_TRACKERS) => {
	return new Promise(async (resolve) => {
		//List all airports used for trackers
		let tAirports = await listFrequentTrackersAirports();

		//Then find the closest airports
		//let cAirports = await closestAirports({longitude, latitude}, numberAirports * 2, {iataCode: {$in: tAirports}});
		let cAirports = await closestAirports({longitude, latitude}, numberTrackers * 2, tAirports);
		let cAirportsIata = cAirports.map(a => a.iataCode);

		//Then return trackers with the closest airports
		let cTrackers = await findClosestTrackersAndSort(cAirportsIata, numberTrackers);

		resolve(cTrackers.slice(0, numberTrackers));
	})
};

/**
 * Find the closest airport based on the IP details
 * @param {Object} param
 */
export const findClosestAirport = ({longitude, latitude}) => {
	return new Promise(async (resolve) => {
		let cAirports = await closestAirportsFromDb({longitude, latitude}, 1, {iataCode: {$ne: ''}});
		if(cAirports.length === 0) return resolve(null);
		let cAirport = cAirports[0];
		cAirport.distance = computeGeoDistance(latitude, longitude, cAirport.latitude, cAirport.longitude);
		resolve(cAirport);
	});
}

/**
 * Deprecated, use findClosestAirport instead
 * @param {*} userIPInfo 
 */
export const getClosestAirport = async (userIPInfo) => {
	const {latitude, longitude} = userIPInfo;
	let closestAirport = null;
	let distance;

	try{
		//Retrive airports from the database, only medium and large ones 
		let fields = {name: 1, continent: 1, country: 1, region: 1, city: 1, iataCode: 1, longitude: 1, latitude: 1};
		let query = { $and: [
			{$or: [{type: 'medium_airport'}, {type: 'large_airport'}]}, 
			{iataCode:{$ne: ''}}
		]};

		const bigAirports = await airportsWithFilter(query, fields);
		
		bigAirports.forEach((airport) => {
			//Compute distance between user and airports
			distance = computeGeoDistance(latitude, longitude, airport.latitude, airport.longitude);

			if(!closestAirport || distance < closestAirport.distance){
				closestAirport = Object.assign({}, {distance}, airport._doc);
			}
		});
	}catch(error){
		console.log("Error:", error);
	}

	return closestAirport;
};


