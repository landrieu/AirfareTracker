import { airportsBySearchTerm as searchAirportsByTerm} from '../services/data/airport';

module.exports = {
    Query: {
        /**
         * Return airports matching with the search term
         * @param {Object} param
         */
        airportsBySearchTerm: async (_, {searchTerm}) => {
            let airports = await searchAirportsByTerm(searchTerm);
            if(!airports) return {success: false, errors: ['No airport found']};
            
            return {success: true, airports, searchTerm};
        }
    }
}
