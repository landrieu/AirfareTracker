import { User } from '../models/User';
import { Tracker } from '../models/Tracker';

module.exports = {
    Query: {
        users: () => {
            return User.find();
        },
        userByEmail: (_, {email}) => {
            return User.findOne({email});
        }
    },
    Mutation: {
        createUser: (_, {email}) => {
            const user = new User({email, password: 'fbazvfu', lastConnectionAt: null});
            return user.save();
        },
        updateLastConnection: async (_, {userId}) => {
            try {
                await User.findOneAndUpdate(
                    {_id: userId}, 
                    {$set: {lastConnectionAt: new Date()}}, 
                    {useFindAndModify: false}
                );
                return true;
            } catch (error) {
                return false;
            }            
        }
    },
    User: {
        /**
         * Return trackers associated to a user
         * @param {Object} user 
         */
        trackers(user) {
            return Tracker.find({"_id": {"$in": user.trackers}});
        }
    }
}