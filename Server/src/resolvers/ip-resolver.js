import { findClosestTrackers, findClosestAirport } from '../services/helpers/geo';
import { VerifyAuthentication } from '../services/helpers/authentication';

import { IP } from '../database/models/IP';


import { randomTrackers } from '../services/data/tracker';

import { IPFinder } from '../classes/IPFinder';
import { ROLES } from '../services/constants/index';

module.exports = {
    Query: {
        getLastIPs: async (_, { } , {auth}) => {
            try {
                const user = await VerifyAuthentication(auth);
                console.log(user);
                if (user.role !== ROLES.ADMIN) throw new Error('You must be an admin to access this resource!');
                
                let lastIPs = IP.find().sort({_id:-1}).limit(50);

                return {success: true, data: lastIPs};
            } catch (error) {
                return {success: false, data: [], message: error.message};
            }
        }
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