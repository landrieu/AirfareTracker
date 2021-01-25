import { findClosestTrackers, findClosestAirport } from '../services/helpers/geo';
import { randomTrackers } from '../services/data/tracker';

import { IPFinder } from '../classes/IPFinder';

module.exports = {
    Query: {

    },
    Mutation: {
        /**
         * Return client IP details
         * @param {String} clientIPAddress 
         */
        findIP: async (_, { }, { clientIPAddress }) => {
            return new Promise(resolver => {
                ipFinder.search(clientIPAddress, resolver);
            });
        },

        /**
         * Find the nearest airport based on IP details
         * @param {String} clientIPAddress 
         */
        findIPAirport: (_, { }, { clientIPAddress }) => {
            return new Promise(resolver => {
                const findAirport = async ({ success, data }) => {
                    if (!success) return resolver({ success });

                    let airport = await findClosestAirport(data);
                    resolver({ success: true, airport });
                }
                //Fetch IP details
                ipFinder.search(clientIPAddress, findAirport);
            });
        },

        /**
         * Find trackers that are the most interesting based on the IP info
         * @param {String} clientIPAddress
         */
        findIPTrackers: (_, { }, { clientIPAddress }) => {
            return new Promise(resolver => {
                const findTrackers = async ({ success, data }) => {
                    if (!success) {
                        //Return random trackers
                        return resolver({ success: true, trackers: (await randomTrackers(6)).map(tracker => ({ id: tracker._id, ...tracker })) });
                    }

                    let trackers = await findClosestTrackers(data, 6);
                    resolver({ success: true, trackers });
                }
                //Fetch IP details
                ipFinder.search(clientIPAddress, findTrackers);
            });
        }
    }
}

let ipFinder = new IPFinder();