import { Airport } from '../database/models/Airport';
import { Airfare } from '../database/models/Airfare';

import { groupAndMergedAirfares, computeStats as computeAirfaresStats} from '../services/data/airfare';

import _ from '../services/helpers/date';

module.exports = {
    Query: {
        airfares:() => {
            return Airfare.find();
        },
        airfaresByTrackerId: async (_, {trackerId, computeStats = true}) => {
            const query = {trackerId};
            let airfares = await Airfare.find(query);

            let grouppedMergedAirfares = groupAndMergedAirfares(airfares);
            if(!computeStats) return {airfaresPerTerm: grouppedMergedAirfares};

            let stats = computeAirfaresStats(airfares); 

            return {stats, airfaresPerTerm: grouppedMergedAirfares};
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
