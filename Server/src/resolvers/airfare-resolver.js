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
        deleteAirfares: async (_, {trackerId}, {auth}) => {

            try{
                //Remove the airfares
                //const removedTracker = await Tracker.findOneAndDelete({_id: trackerId, userId: user.id}, {useFindAndModify: false});
                const removed = await Airfare.deleteMany({trackerId: trackerId}, {useFindAndModify: false});
                
                if(!removed){
                    throw new Error("Airfares have not been removed");
                }
                
                return true;
            }catch(error){
                console.log(error.message);
                return false;
            }
        },
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
