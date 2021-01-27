import { Airport } from '../database/models/Airport';
import { Airfare } from '../database/models/Airfare';

import { groupAndMergedAirfares, computeStats as computeAirfaresStats} from '../services/data/airfare';

import _ from '../services/helpers/date';

module.exports = {
    Query: {
        /**
         * Return all the airfares
         */
        airfares:() => {
            return Airfare.find();
        },

        /**
         * Return a single tracker by ID
         * @param {Object} param 
         * @param {String} trackerId
         * @param {Boolean} computeStats Compute basic stats 
         */
        airfaresByTrackerId: async (_, {trackerId, computeStats = true}) => {
            const query = {
                trackerId,
                //"createdAt" : { $gte : new Date("2021", "00", "01") }
            };

            
            //Fetch airfares
            let airfares = await Airfare.find(query);//.sort({"createdAt": -1}).limit(100);

            //Group and merge airfares
            let grouppedMergedAirfares = groupAndMergedAirfares(airfares);
            if(!computeStats) return {airfaresPerTerm: grouppedMergedAirfares};

            //Compute basic stats
            let stats = computeAirfaresStats(airfares); 

            return {stats, airfaresPerTerm: grouppedMergedAirfares};
        },

        /**
         * Return number of existing airfares
         * @param {Object} param
         */
        airfaresNumber: (_ , {trackerId}) => {
            return Airfare.count(trackerId ? {trackerId} : {}).then(res => ({n: res}));
        }
    },
    Mutation: {
        /**
         * Delete airfares
         * @param {*} param1 
         * @param {*} param2 
         */
        deleteAirfares: async (_, {trackerId}, {auth}) => {

            try{
                //Remove the airfares
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
         * Return airport info
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
