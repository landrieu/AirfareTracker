import { ObjectID } from 'mongodb';
import { Tracker } from '../models/Tracker';
import { Airport } from '../models/Airport';

module.exports = {
    Query: {
        
    },
    Mutation: {
        
    },

    GetAirports: (filter, fields) => {
        return Airport.find(filter, fields || {});
    }
}
