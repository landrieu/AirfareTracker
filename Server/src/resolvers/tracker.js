import {VerifyAuthentication} from '../services/authentication';

import { ObjectID } from 'mongodb';
import { Tracker } from '../database/models/Tracker';
import { Airport } from '../database/models/Airport';
import { User } from '../database/models/User';

import {validateNewTracker} from '../services/validation/tracker';
import {UserInputError, AuthenticationError, ValidationError} from 'apollo-server';


module.exports = {
    Query: {
        trackers: () => {
            return Tracker.find();
        },
        trackersByUser: (_, {userId}) => {
            const query = {userId};
            return Tracker.find(query);
        },
        trackersNumber: async (_, {userId}) => {
            if(userId){
                return await Tracker.count({userId});
            }else{
                return await Tracker.countDocuments();
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
            //console.log(tracker);
            const { errors, valid } = validateNewTracker(tracker);
            if (!valid) throw new UserInputError('Error', { errors });

            if(!tracker.userId){
                tracker.userId = await User.findOne({email: tracker.userEmail}, {userId: '1'}).userId;
            }

            const newTracker = new Tracker(Object.assign({}, tracker, {isActive: true}));

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
        deleteTracker: async (_, {trackerId}, {auth}) => {
            const user = await VerifyAuthentication(auth);

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

