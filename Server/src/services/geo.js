const airportResolver = require('../resolvers/airport');
const trackerResolver = require('../resolvers/tracker');

import { getTrackers } from '../services/data/tracker';

const EARTH_RADIUS = 6371; // Radius of the earth in km
const NB_TRACKERS = 6;

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
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

function deg2rad(deg) {
	return deg * (Math.PI/180)
}

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

		const bigAirports = await airportResolver.GetAirports(query, fields);
		
		bigAirports.forEach((airport) => {
			//Compute distance between user and airports
			distance = getDistanceFromLatLonInKm(latitude, longitude, airport.latitude, airport.longitude);

			if(!closestAirport || distance < closestAirport.distance){
				closestAirport = Object.assign({}, {distance}, airport._doc);
			}
		});
	}catch(error){
		console.log("Error:", error);
	}

	return closestAirport;
};

/**
 * Get the most interesting trackers (closest airports from the user)
 * @param {Object} userIPInfo 
 */
export const getMostITrackers = async (userIPInfo) => { 
	const {latitude, longitude} = /*{latitude: 1.290270, longitude: 103.851959};//*/userIPInfo;
	let distanceA, distanceB, trackers = [];

	try{
		//Retrive airports from the database, only medium and large ones 
		let fields = {};
		let query = {};

		const filter = { $and: [{ type : "F" }, { isActive: true }] };
        trackers = await getTrackers(filter, query)

		let distanceFromA, distanceFromB, distanceToA, distanceToB;

		trackers.sort((aTracker, bTracker) => {
			distanceFromA = getDistanceFromLatLonInKm(latitude, longitude, aTracker.airportInfoFrom[0].latitude, aTracker.airportInfoFrom[0].longitude);
			distanceToA = getDistanceFromLatLonInKm(latitude, longitude, aTracker.airportInfoTo[0].latitude, aTracker.airportInfoTo[0].longitude);
			
			
			distanceFromB = getDistanceFromLatLonInKm(latitude, longitude, bTracker.airportInfoFrom[0].latitude, bTracker.airportInfoFrom[0].longitude);
			distanceToB = getDistanceFromLatLonInKm(latitude, longitude, bTracker.airportInfoTo[0].latitude, bTracker.airportInfoTo[0].longitude);
			
			distanceA = distanceFromA < distanceToA ? distanceFromA : distanceToA;
			distanceB = distanceFromB < distanceToB ? distanceFromB : distanceToB;

			return distanceA - distanceB;
		})
		
	}catch(error){
		console.log("Error:", error);
	}

	return trackers.slice(0, NB_TRACKERS);
};
