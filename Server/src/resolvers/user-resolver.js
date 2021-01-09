import bcrypt from 'bcryptjs';
import { ObjectID } from 'mongodb';

import { User } from '../database/models/User';
import { Tracker } from '../database/models/Tracker';
import { GenerateToken, VerifyAuthentication } from '../services/helpers/authentication';
import { NB_TRACKERS_PER_USER } from '../services/constants';

import { validateRegister, validateLogin } from '../services/data/user';
import { AUTH_ERRORS } from '../services/constants/errors';

//import { /*UserInputError, AuthenticationError, */ValidationError } from 'apollo-server';

import { UserInputError, ValidationError, AuthenticationError, LoginSuccess, RegisterSuccess, OperationError, OperationSuccess, OperationResult } from '../classes/RequestOperation';

const roles = {
    admin: "ADMIN",
    user: "USER"
};

module.exports = {
    Query: {
        users: async (_, { }, { auth }) => {
            try {
                const user = await VerifyAuthentication(auth);
                if(user.role === roles.admin) return User.find();
            } catch (error) {
                //console.log(error);
                return error;
            }
        },
        userByEmail: (_, { email }) => {
            return User.findOne({ email });
        },
        validAuthentication: async (_, { }, { auth }) => {
            try {
                const user = await VerifyAuthentication(auth);
                return !!user;
            } catch {
                //console.log(error.message, error.name)
                return false;
            }
        },
        numberTrackersCreatable: async (_, { }, { auth }) => {
            try {
                console.log(auth);
                const user = await VerifyAuthentication(auth);
                let nbTrackersCreated = await Tracker.countDocuments({ $or: [{ userId: user.id }, { userEmail: user.email }] });
                let nbTrackersCreatable = NB_TRACKERS_PER_USER.REGISTERED - nbTrackersCreated;
                console.log(nbTrackersCreated, nbTrackersCreatable, NB_TRACKERS_PER_USER.REGISTERED);
                return { success: true, canCreateNewTracker: nbTrackersCreatable > 0, nbTrackersCreated };
            } catch {
                //console.log(error.message, error.name)
                return { success: false, error: 'The authentication is incorrect' };
            }
        }
    },
    Mutation: {
        createUser: async (_, { email, password }) => {
            const { errors, valid } = validateRegister(email, password);
            if (!valid) return new UserInputError('REGISTRATION_ERROR', errors);

            const existingUser = await User.findOne({ email });
            if (existingUser) return new ValidationError('REGISTRATION_ERROR', [{message: AUTH_ERRORS.USER_ALREADY_EXISTS}]);

            password = await bcrypt.hash(password, 10); // hashing the password

            //Check if trackers already exist for this user and add them to the user profile
            let userTrackers = await Tracker.find({ userEmail: email }, { _id: 1 }).map((tr) => ObjectID(tr._id));

            const newUser = new User({
                email,
                password,
                role: roles.user,
                trackers: userTrackers || [],
                registrationDate: new Date().toISOString(),
                lastConnectionAt: null
            });

            const res = await newUser.save();

            //Set userID in the tracker records
            await Tracker.updateMany({ userEmail: email }, { $set: { userId: res._id } });

            //const token = GenerateToken(res);
            return new RegisterSuccess(true, res._doc);
            /*return {
                id: res._id,
                ...res._doc,
                token
            };*/
        },
        loginUser: async (_, { email, password }) => {
            // validateLogin is a simple func that checks for empty fields
            // and return valid = false if any.
            const { errors, valid } = validateLogin(email, password);
            if (!valid) return new UserInputError('LOGIN_ERROR', errors);

            // Check if that user already exists
            const user = await User.findOne({ email });
            if (!user) return new AuthenticationError('LOGIN_ERROR', [{target: "email", message: AUTH_ERRORS.USER_NOT_EXISTS}]);

            // Check the password
            const match = await bcrypt.compare(password, user.password);
            if (!match) return new AuthenticationError('', [{ target: "password", message: AUTH_ERRORS.PASSWORD_INCORRECT }]);

            // Generate a token and return user info
            const token = GenerateToken(user); 
            return new LoginSuccess(user._id, user._doc, `Bearer ${token}`);
        },
        updateLastConnection: async (_, {}, {auth}) => {
            const user = await VerifyAuthentication(auth);
            try {
                await User.findOneAndUpdate(
                    { _id: user.id },
                    { $set: { lastConnectionAt: new Date() } },
                    { useFindAndModify: false }
                );
                return new OperationResult(true, 'User update', null);
            } catch (error) {
                return new OperationResult(false, 'User update', 'Could not update user');
            }
        },
        deleteUser: async (_, { userId }) => {
            const user = await VerifyAuthentication(auth);
            //Check if the user is an admin
            try {
                //Delete the user
                const user = await User.findOneAndDelete({ _id: userId }, { useFindAndModify: false });

                if (user) {
                    //Disable all the trackers associated to the user
                    await Tracker.updateMany({ userId }, { $set: { isActive: false } }, { useFindAndModify: false });
                }
                return { success: true };
            } catch (error) {
                return { success: false, error };
            }
        }
    },
    User: {
        /**
         * Return trackers associated to a user
         * @param {Object} user 
         */
        trackers(user) {
            return Tracker.find({ "_id": { "$in": user.trackers } });
        },
    },

    LoginResult: {
        __resolveType(obj, context, info) {
            if (obj.token) {
                return 'LoginSuccess';
            }

            return 'ErrorResult';
        },
    },

    RegisterResult: {
        __resolveType(obj, context, info) {
            if (obj.user) {
                return 'RegisterSuccess';
            }

            return 'ErrorResult';
        },
    }
}