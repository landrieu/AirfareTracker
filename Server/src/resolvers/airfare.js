import { ObjectID } from 'mongodb';
import { Tracker } from '../database/models/Tracker';
import { Airport } from '../database/models/Airport';
import { Airfare } from '../database/models/Airfare';

module.exports = {
    Query: {
        airfares:() => {
            return Airfare.find();
        },
        airfaresByTrackerId: (_, {trackerId}) => {
            const query = {trackerId};
            return Airfare.find(query);
        },
        airfaresNumber: (_ , {trackerId}) => {
            return Airfare.count(trackerId ? {trackerId} : {}).then(res => ({n: res}));
        }
    },
    Mutation: {
        
    },
    Airfare: {
        /**
         * Return trackers associated to a user
         * @param {Object} tracker 
         */
        from(airfare) {
            return Airport.findOne({"iataCode": airfare.from});
        },
        to(airfare) {
            return Airport.findOne({"iataCode": airfare.to});
        }
    }
}
