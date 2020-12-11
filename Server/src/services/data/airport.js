import { Airport } from '../../database/models/Airport';;

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