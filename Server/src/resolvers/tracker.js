import { ObjectID } from 'mongodb';
import { Tracker } from '../models/Tracker';
import { User } from '../models/User';

module.exports = {
    Query: {
        trackers: () => {
            return Tracker.find();
        },
        trackersByUser: (_, {userId}) => {
            const query = {userId};
            return Tracker.find(query);
        }
    },
    Mutation: {
        createTracker: async (_, {from, to, userId}) => {
            let startDates = [new Date()];
            let endDates = [new Date()];
            const newTracker = new Tracker({from, to, startDates, endDates, userId});

            try{
                //Save tracker
                const savedTracker = await newTracker.save();
                //If a user ID exists add it to the user profile
                const query = {_id: userId};
                await User.findOneAndUpdate(query, {$addToSet: {trackers: savedTracker._id}}, {useFindAndModify: false});

                return savedTracker;
            }catch(error){
                
            }
        },
        deleteTracker: async (_, {trackerId}) => {
            try{
                //Remove the tracker
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
        updateTrackerStatus: (_, {trackerId, newStatus}) => {
            return Tracker.findOneAndUpdate(
                {_id: trackerId}, 
                {$set: {isActive: newStatus}}, 
                {useFindAndModify: false}
            );
        }
    }
}