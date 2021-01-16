import moment from 'moment';
import { VerifyAuthentication } from '../services/helpers/authentication';

import { ObjectID } from 'mongodb';
import { Tracker } from '../database/models/Tracker';
import { Airport } from '../database/models/Airport';
import { Airfare } from '../database/models/Airfare';
import { User } from '../database/models/User';

import { OperationResult } from '../classes/RequestOperation';
import { validateNewTracker } from '../services/form-validation/tracker';
import { formatNormalTracker, formatFrequentTracker } from '../services/data/tracker';
import { sendNewTrackerEmail } from '../services/helpers/notifications';

import { airportSearch } from '../services/data/airport';
import { TrackerCreationSuccess, OperationError, UserInputError, UnexpectedError, Error, InputError } from '../classes/RequestOperation';

module.exports = {
    Query: {
        trackers: (_, { type, id }) => {
            let filter = {};
            if (id) filter = { _id: ObjectID(id) };
            if (type) filter = { ...filter, type };
            return Tracker.find(filter);
        },
        trackersByUser: async (_, { userId }, { auth }) => {
            const user = await VerifyAuthentication(auth);
            return Tracker.find({ $or: [{ userId: user ? user.id : userId }, { userEmail: user ? user.email : null }] });
        },
        trackersNumber: (_, { userId }) => {
            if (userId) {
                return Tracker.count({ userId }).then(res => ({ n: res }));
            } else {
                return Tracker.countDocuments().then(res => ({ n: res }));
            }
        },
        trackersActiveNumber: (_, { userId }) => {
            let query = { isActive: true };
            if (userId) {
                query.userId = userId;
            }

            return Tracker.count(query);
        },
        trackersRandom: (_, { type }) => {
            return Tracker.aggregate([
                { $sample: { size: 2 } }
            ]);
            //for(let i )
            /*return Tracker.aggregate([
                { $match: { _id: { $nin: randomDocs.map(doc => doc._id) } } },
                { $sample: { size: 10 } } 
            ]);*/
        }
    },
    Mutation: {
        /**
         * 2 Options:
         *  - Logged
         *  - Not logged
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

            const { errors, valid } = await validateNewTracker(tracker);
            if (!valid) return new UserInputError('TRACKER_CREATION_ERROR', { errors });
            return new UserInputError('TRACKER_CREATION_ERROR', [new InputError(null, 'Test 1'), new InputError(null, 'Test 2')]);

            const newTracker = new Tracker(tracker);

            try {
                //Save tracker
                const sTracker = await newTracker.save();
                //If a user ID exists add it to the user profile
                /*if (userId) {
                    const query = { _id: tracker.userId };
                    await User.findOneAndUpdate(query, { $addToSet: { trackers: sTracker._id } }, { useFindAndModify: false });
                }*/
                await sendNewTrackerEmail(sTracker, tracker, userEmail);

                return new TrackerCreationSuccess({ id: sTracker._id, ...sTracker._doc });
            } catch (error) {
                console.log(error.message);
                return UnexpectedError('TRACKER_CREATION_ERROR', [new Error('', 'Database error')])
            }
        },
        async createFrequentTracker(_, tracker, { auth }) {
            try {
                const user = await VerifyAuthentication(auth);
                if (user.role === roles.admin) return new Error();

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
        updateTrackerStatus: async (_, { trackerId, newStatus }, { auth }) => {
            //@TODO: Check if the user can enable the tracker, check the limit
            try {
                const user = await VerifyAuthentication(auth);
                const tracker = await Tracker.findOne({ _id: ObjectID(trackerId) });
                if (!tracker) throw new Error("Could not find the tracker");

                if (tracker.userId !== user.id && tracker.userEmail !== user.email) throw new Error("This tracker doesn't belong to the user");

                let res = await Tracker.updateOne(
                    { _id: trackerId },
                    { $set: { isActive: newStatus } },
                    { useFindAndModify: false }
                );
                if (res.n === 0) throw new Error("No tracker has been updated");
                return new OperationResult(true, 'UPDATE_TRACKER_STATUS');
            } catch (error) {
                //console.log(error.message, error.msg)
                return new OperationResult(false, 'UPDATE_TRACKER_STATUS', error.message);
            }

        },

        updateTrackerAlertStatus: async (_, { trackerId, newStatus }, { auth }) => {
            //@TODO: Check if the user can enable the tracker, check the limit
            try {
                const user = await VerifyAuthentication(auth);
                const tracker = await Tracker.findOne({ _id: ObjectID(trackerId) });
                if (!tracker) throw new Error("Could not find the tracker");

                if (tracker.userId !== user.id && tracker.userEmail !== user.email) throw new Error("This tracker doesn't belong to the user");

                let res = await Tracker.updateOne(
                    { _id: trackerId },
                    { $set: { isAlertActive: newStatus } },
                    { useFindAndModify: false }
                );
                if (res.n === 0) throw new Error("No tracker has been updated");
                return new OperationResult(true, 'UPDATE_TRACKER_ALERT_STATUS');
            } catch (error) {
                //console.log(error.message, error.msg)
                return new OperationResult(false, 'UPDATE_TRACKER_ALERT_STATUS', error.message);
            }

        },

        updateTracker: async (_, { trackerId, trackerStatus, trackerAlertStatus, trackerTriggerPrice }, { auth }) => {
            try {
                const user = await VerifyAuthentication(auth);
                const tracker = await Tracker.findOne({ _id: ObjectID(trackerId) });
                if (!tracker) throw new Error("Could not find the tracker");

                if (tracker.userId !== user.id && tracker.userEmail !== user.email) throw new Error("This tracker doesn't belong to the user");

                let query = {};
                if (typeof trackerStatus === "boolean") query.isActive = trackerStatus;
                if (typeof trackerAlertStatus === "boolean") query.isAlertActive = trackerAlertStatus;
                if (typeof trackerTriggerPrice === "number") query.triggerPrice = trackerTriggerPrice;

                let res = await Tracker.updateOne(
                    { _id: trackerId },
                    { $set: query },
                    { useFindAndModify: false }
                );
                if (res.n === 0) throw new Error("No tracker has been updated");
                return new OperationResult(true, 'UPDATE_TRACKER');
            } catch (error) {
                //console.log(error.message, error.msg)
                return new OperationResult(false, 'UPDATE_TRACKER', error.message);
            }

        },
    },
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
            //Create a map containing all the occurences
            /*let occurrencesMap = new Map(airfares.map((airfare) => {
                return [`${airfare.occurrence.interval}${airfare.occurrence.length}`, airfare.occurrence];
            }));

            console.log(occurrencesMap)*/
            //occurrencesMap.
            /*let map = {};
            // id, data, position
            let airfaresPerOccurence = airfares.reduce((acc, cur) => {
                let id = `${cur.occurrence.interval}${cur.occurrence.length}`;
                if(map[id] === undefined){
                    acc.push([cur]);
                    map[id] = acc.length - 1;
                }else{
                    acc[map[id]].push(cur);
                }
                return acc;
            }, []).map(airfares => airfares.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));

            
            console.log(airfaresPerOccurence);
            console.log(map)*/
            return airfares;
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

