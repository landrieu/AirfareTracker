import { VerifyAuthentication } from '../services/helpers/authentication';

import { ObjectID } from 'mongodb';
import { Tracker } from '../database/models/Tracker';
import { Airport } from '../database/models/Airport';
import { Airfare } from '../database/models/Airfare';
import { User } from '../database/models/User';

import { OperationResult } from '../classes/RequestOperation';
import { validateNewTracker } from '../services/form-validation/tracker';
import { formatNormalTracker, formatFrequentTracker } from '../services/data/tracker';
import { canCreateOrActivateTracker } from '../services/data/user';
import { sendNewTrackerEmail } from '../services/helpers/notifications';

import { airportSearch } from '../services/data/airport';
import { TrackerCreationSuccess, UserInputError, UnexpectedError, Error } from '../classes/RequestOperation';
import { ROLES } from '../services/constants/index';

module.exports = {
    Query: {
        /**
         * Return list of trackers
         * @param {String} type Tracker type F' or 'N'
         * @param {String} id Tracker ID 
         */
        trackers: (_, { type, id }) => {
            let filter = {};
            if (id) filter = { _id: ObjectID(id) };
            if (type) filter = { ...filter, type };
            return Tracker.find(filter);
        },

        /**
         * Return trackers created by a user
         * @param {String} userId
         * @param {Object} auth 
         */
        trackersByUser: async (_, { userId }, { auth }) => {
            const user = await VerifyAuthentication(auth);
            return Tracker.find({ $or: [{ userId: user ? user.id : userId }, { userEmail: user ? user.email : null }] });
        },

        /**
         * Return number of trackers created by a user or number of all the trackers created
         * @param {String} userId
         */
        trackersNumber: (_, { userId }) => {
            if (userId) {
                return Tracker.count({ userId }).then(res => ({ n: res }));
            } else {
                return Tracker.countDocuments().then(res => ({ n: res }));
            }
        },

        /**
         * Return number of active trackers
         * @param {String} userId
         */
        trackersActiveNumber: (_, { userId }) => {
            let query = { isActive: true };
            if (userId) {
                query.userId = userId;
            }

            return Tracker.count(query);
        },

        /**
         * Return random trackers
         */
        trackersRandom: (_, { }) => {
            return Tracker.aggregate([
                { $sample: { size: 2 } }
            ]);
        }
    },
    Mutation: {
        /**
         * 2 Options:
         *  - Logged
         *  - Not logged
         * @param {Object} tracker Tracker data
         */
        createTracker: async (_, tracker, { auth }) => {
            let userId, userEmail;
            try {
                const user = await VerifyAuthentication(auth);
                userId = user.id;
                userEmail = user.email;
            } catch {
                //User not logged
                //If user not logged but registered
                userId = await User.findOne({ email: tracker.userEmail }, { userId: '1' }).userId;
                userEmail = tracker.userEmail;
            }

            //Format tracker to save in the Database
            tracker = formatNormalTracker(tracker, userId, userEmail);

            //Validate tracker data
            const { errors, valid } = await validateNewTracker(tracker);
            if (!valid) return new UserInputError('TRACKER_CREATION_ERROR', errors );

            const newTracker = new Tracker(tracker);

            try {
                //Save tracker
                const sTracker = await newTracker.save();
                //Send notification to the user
                await sendNewTrackerEmail(sTracker, tracker, userEmail);

                return new TrackerCreationSuccess({ id: sTracker._id, ...sTracker._doc });
            } catch (error) {
                console.log(error.message);
                return UnexpectedError('TRACKER_CREATION_ERROR', [new Error('', 'Database error')])
            }
        },

        /**
         * Create a frequent tracker
         * @param {Object} tracker Tracker data
         */
        async createFrequentTracker(_, tracker, { auth }) {
            try {
                const user = await VerifyAuthentication(auth);
                if (user.role !== ROLES.ADMIN) return new Error();

                //Check if the user is an admin
                tracker = formatFrequentTracker(tracker);
                const { errors, valid } = await validateNewTracker(tracker);
                if (!valid) throw new UserInputError('Error', { errors });

                const newTracker = new Tracker(tracker);
                //Save tracker
                return newTracker.save();
            } catch (error) {
                console.log(error.message);
            }
        },

        /**
         * Delete a tracker
         * @param {*} trackerId Tracker id of the tracker to delete
         */
        deleteTracker: async (_, { trackerId }, { auth }) => {
            //const user = await VerifyAuthentication(auth);

            try {
                //Remove the tracker
                //const removedTracker = await Tracker.findOneAndDelete({_id: trackerId, userId: user.id}, {useFindAndModify: false});
                const removedTracker = await Tracker.findOneAndDelete({ _id: trackerId }, { useFindAndModify: false });

                if (!removedTracker) {
                    throw new Error("Tracker has not been removed");
                }

                //Then remove tracker id from the user profile
                const query = { _id: removedTracker.userId };
                await User.updateOne(query, { $pull: { trackers: ObjectID(trackerId) } });

                return { success: true };
            } catch (error) {
                console.log(error.message);
                return { success: false };
            }
        },

        /**
         * Update tracker info: tracker status, tracker alert status and trigger price
         * @param {String} trackerId
         * @param {Boolean} trackerStatus Is the tracker active
         * @param {Boolean} trackerAlertStatus Should send an alert to the tracker's creator
         * @param {Number} trackerTriggerPrice 
         */
        updateTracker: async (_, { trackerId, trackerStatus, trackerAlertStatus, trackerTriggerPrice }, { auth }) => {
            try {
                const user = await VerifyAuthentication(auth);
                //Fetch the tracker
                const tracker = await Tracker.findOne({ _id: ObjectID(trackerId) });
                if (!tracker) return new OperationResult(false, 'UPDATE_TRACKER', "Could not find the tracker");

                //Check if the update is made by the creator
                if (tracker.userId !== user.id && tracker.userEmail !== user.email) throw new Error("This tracker doesn't belong to the user");

                let query = {};
                if (typeof trackerStatus === "boolean"){
                    query.isActive = trackerStatus;
                    if(trackerStatus){
                        let {canCreateNewTracker, error} = await canCreateOrActivateTracker(user, auth, null);
                        if(error) return new OperationResult(false, 'UPDATE_TRACKER', error.message);
                        if(!canCreateNewTracker) return new OperationResult(false, 'UPDATE_TRACKER', 'The limit has been reached');
                    } 
                    //Check if tracker dates are in the future
                } 
                if (typeof trackerAlertStatus === "boolean") query.isAlertActive = trackerAlertStatus;
                if (typeof trackerTriggerPrice === "number") query.triggerPrice = trackerTriggerPrice;

                //Update the tracker in the database
                let res = await Tracker.updateOne(
                    { _id: trackerId },
                    { $set: query },
                    { useFindAndModify: false }
                );
                if (res.n === 0) return new OperationResult(false, 'UPDATE_TRACKER', "No tracker has been updated");
                return new OperationResult(true, 'UPDATE_TRACKER');
            } catch (error) {
                //console.log(error.message, error.msg)
                return new OperationResult(false, 'UPDATE_TRACKER', error.message);
            }

        },
    },
    /**
     * Return airports short info
     */
    TrackerShort: {
        from(tracker) {
            if (airportSearch.dataLoaded()) {
                return airportSearch.getAirport(tracker.from);
            }
            return Airport.findOne({ "iataCode": tracker.from });
        },
        to(tracker) {
            if (airportSearch.dataLoaded()) {
                return airportSearch.getAirport(tracker.to);
            }
            return Airport.findOne({ "iataCode": tracker.to });
        }
    },

    /**
     * Return airports info
     */
    Tracker: {
        /**
         * Return trackers associated to a user
         * @param {Object} tracker 
         */
        from(tracker) {
            return Airport.findOne({ "iataCode": tracker.from });
        },
        to(tracker) {
            return Airport.findOne({ "iataCode": tracker.to });
        },

        /**
         * Return airfares attached to a tracker
         * @param {Object} tracker 
         */
        async airfares(tracker) {
            let airfares = await Airfare.find({ "trackerId": tracker._id });

            let airfaresByDates = new Map(), key;
            //Group by start and end dates
            airfares.forEach((airfare) => {
                //key = {startDate: , endDate: airfare.endDate};
                key = `${airfare.startDate}${airfare.endDate}`;
                //Determine if the airfare's date
                if (airfaresByDates.has(key)) {
                    airfaresByDates.set(key, {
                        ...airfaresByDates.get(key),
                        airfares: [...airfaresByDates.get(key).airfares, airfare]
                    });
                } else {
                    airfaresByDates.set(key, {
                        startDate: airfare.startDate,
                        endDate: airfare.endDate,
                        airfares: [airfare]
                    })
                }
            });

            let airfaresSorted = [];
            for (const d of airfaresByDates.values()) {
                airfaresSorted.push(d);
            }
            return airfaresSorted;
        }
    },

    TrackerCreationResult: {
        __resolveType(obj, context, info) {
            if (obj.success) {
                return 'TrackerCreationSuccess';
            }

            return 'ErrorResult';
        },
    },
}

