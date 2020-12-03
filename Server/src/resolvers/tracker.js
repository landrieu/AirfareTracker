import {VerifyAuthentication} from '../services/authentication';

import { ObjectID } from 'mongodb';
import { Tracker } from '../database/models/Tracker';
import { Airport } from '../database/models/Airport';
import { User } from '../database/models/User';

import {validateNewTracker} from '../services/validation/tracker';
import {UserInputError, AuthenticationError, ValidationError} from 'apollo-server';
import {FrequentTrackerOccurrences} from '../services/constants'


module.exports = {
    Query: {
        trackers: (_, filter) => {
            return Tracker.find(filter);
        },
        trackersByUser: (_, {userId}) => {
            const query = {userId};
            return Tracker.find(query);
        },
        trackersNumber: (_, {userId}) => {
            if(userId){
                return Tracker.count({userId}).then(res => ({n: res}));
            }else{
                return Tracker.countDocuments().then(res => ({n: res}));
            }
        },
        trackersActiveNumber: (_, {userId}) => {
            let query = {isActive: true};
            if(userId){
                query.userId = userId;
            }

            return Tracker.count(query);
        }
    },
    Mutation: {
        /**
         * 2 Options:
         *  - Logged
         *  - Not logged
         */
        createTracker: async (_, tracker, {auth}) => {
            //const user = await VerifyAuthentication(auth);

            tracker = Object.assign({isActive: true,  type: 'N'}, tracker);
            const { errors, valid } = await validateNewTracker(tracker);
            if (!valid) throw new UserInputError('Error', { errors });

            if(!tracker.userId){
                tracker.userId = await User.findOne({email: tracker.userEmail}, {userId: '1'}).userId;
            }

            const newTracker = new Tracker(tracker);

            try{
                //Save tracker
                const savedTracker = await newTracker.save();
                //If a user ID exists add it to the user profile
                if(tracker.userId){
                    const query = {_id: tracker.userId};
                    await User.findOneAndUpdate(query, {$addToSet: {trackers: savedTracker._id}}, {useFindAndModify: false});
                }
                
                return savedTracker;
            }catch(error){
                console.log(error);
            }
        },
        async createFrequentTracker(_, tracker){
            //Check if the user is an admin
            tracker.occurrences = tracker.occurrences || FrequentTrackerOccurrences;
            tracker = Object.assign({isActive: true, type: 'F'}, tracker);
            const { errors, valid } = await validateNewTracker(tracker);
            if (!valid) throw new UserInputError('Error', { errors });

            const newTracker = new Tracker(tracker);

            try{
                //Save tracker
                return newTracker.save();                
            }catch(error){
                console.log(error);
            }
        },
        deleteTracker: async (_, {trackerId}, {auth}) => {
            //const user = await VerifyAuthentication(auth);

            try{
                //Remove the tracker
                //const removedTracker = await Tracker.findOneAndDelete({_id: trackerId, userId: user.id}, {useFindAndModify: false});
                const removedTracker = await Tracker.findOneAndDelete({_id: trackerId}, {useFindAndModify: false});
                
                if(!removedTracker){
                    throw new Error("Tracker has not been removed");
                }

                //Then remove tracker id from the user profile
                const query = {_id: removedTracker.userId};
                await User.updateOne(query, {$pull: {trackers: ObjectID(trackerId)}});
                
                return {success: true};
            }catch(error){
                console.log(error);
                return {success: false};
            }
        },
        updateTrackerStatus: async (_, {trackerId, newStatus}) => {
            try{
                await Tracker.findOneAndUpdate(
                    {_id: trackerId}, 
                    {$set: {isActive: newStatus}}, 
                    {useFindAndModify: false}
                );
                return {success: true};
            }catch(error){
                return {success: false, error};
            }
            
        }
    },
    Tracker: {
        /**
         * Return trackers associated to a user
         * @param {Object} tracker 
         */
        from(tracker) {
            return Airport.findOne({"iataCode": tracker.from});
        },
        to(tracker) {
            return Airport.findOne({"iataCode": tracker.to});
        }
    }
}

