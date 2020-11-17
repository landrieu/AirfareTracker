import { ObjectID } from 'mongodb';
import { Tracker } from '../database/models/Tracker';
import { Airport } from '../database/models/Airport';

module.exports = {
    Query: {
        
    },
    Mutation: {
        
    },

    GetAirports: (filter, fields) => {
        return Airport.find(filter, fields || {});
    }
}
