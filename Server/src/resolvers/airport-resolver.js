import { ObjectID } from 'mongodb';
import { Tracker } from '../database/models/Tracker';
import { Airport } from '../database/models/Airport';

import { airportsBySearchTerm as searchAirportsByTerm} from '../services/data/airport';

module.exports = {
    Query: {
        airportsBySearchTerm: async (_, {searchTerm}) => {
            let airports = await searchAirportsByTerm(searchTerm);
            if(!airports) return {success: false, errors: ['No airport found']};

            return {success: true, airports};
        }
    },
    Mutation: {
        
    }
}
