import bcrypt from 'bcryptjs';
import { ObjectID } from 'mongodb';

import { User } from '../database/models/User';
import { Tracker } from '../database/models/Tracker';
import { IP } from '../database/models/IP';
import { GenerateToken, VerifyAuthentication } from '../services/helpers/authentication';
import { canCreateOrActivateTracker } from '../services/data/user';

import { validateRegister, validateLogin } from '../services/data/user';
import { AUTH_ERRORS } from '../services/constants/errors';
import { sendRegistrationEmail } from '../services/helpers/notifications';

import { UserInputError, ValidationError, AuthenticationError, LoginSuccess, RegisterSuccess, TrackerCreationCheck, OperationResult } from '../classes/RequestOperation';

import { ROLES } from '../services/constants/index';

module.exports = {
    Query: {
        /**
         * Return users info, only for admins
         */
        users: async (_, { }, { auth }) => {
            try {
                const user = await VerifyAuthentication(auth);
                if (user.role === ROLES.ADMIN) return User.find();
            } catch (error) {
                //console.log(error);
                return error;
            }
        },

        /**
         * Fetch user by his email
         * @param {String} email 
         */
        userByEmail: (_, { email }) => {
            return User.findOne({ email });
        },

        /**
         * Check the authentication
         * @param {Object} auth 
         */
        validAuthentication: async (_, { }, { auth }) => {
            try {
                const user = await VerifyAuthentication(auth);
                return !!user;
            } catch {
                //console.log(error.message, error.name)
                return false;
            }
        },

        /**
         * Check if the user can create a new tracker
         * @param {String} email User email
         * @param {Object} auth 
         */
        numberTrackersCreatable: async (_, { email }, { auth }) => {
            try {
                let createTracker;
                createTracker = canCreateOrActivateTracker(null, auth, email);
                return createTracker;
            } catch (error) {
                return new TrackerCreationCheck(false,false, null, 'Unexpected error');
            }
        },

        getGlobalStats: async (_, {}, { auth }) => {
            try {
                const user = await VerifyAuthentication(auth);
                if (user.role !== ROLES.ADMIN) throw new Error('You must be an admin to access this resource!');
                
                let pNbVisitors = IP.count();
                let pNbUsers = User.count();
                let pNbTrackers = Tracker.count();
                let pNbTrackersN = Tracker.count({type: 'N'});
                let pNbTrackersF = Tracker.count({type: 'F'});

                return Promise.all([pNbVisitors, pNbUsers, pNbTrackers, pNbTrackersN, pNbTrackersF]).then((res) => {
                    return {
                        success: true,
                        data: {
                            nbVisitors: res[0],
                            nbUsers: res[1],
                            nbTrackers: res[2],
                            nbTrackersN: res[3],
                            nbTrackersF: res[4],
                        }
                    }
                }).catch((e) => {
                    return {success: false, data: null, message: e.message};
                });
            } catch (e) {
                return {success: false, data: null, message: e.message};
            }
        }
    },
    Mutation: {
        /**
         * Create a user in the database
         * @param {String} email
         * @param {String} password 
         */
        createUser: async (_, { email, password }) => {
            const { errors, valid } = validateRegister(email, password);
            if (!valid) return new UserInputError('REGISTRATION_ERROR', errors);

            //Check if there is a user with the same email address
            const existingUser = await User.findOne({ email });
            if (existingUser) return new ValidationError('REGISTRATION_ERROR', [{ message: AUTH_ERRORS.USER_ALREADY_EXISTS }]);

            //Hashing the password
            password = await bcrypt.hash(password, 10);

            //Check if trackers already exist for this user and add them to the user profile
            let userTrackers = await Tracker.find({ userEmail: email }, { _id: 1 }).map((tr) => ObjectID(tr._id));

            const newUser = new User({
                email,
                password,
                role: ROLES.USER,
                isActive: false,
                trackers: userTrackers || [],
                registrationDate: new Date().toISOString(),
                lastConnectionAt: null
            });

            const res = await newUser.save();
            if (res === 0) return;

            //Send registration email
            await sendRegistrationEmail(res._id);

            //Set userID in the tracker records
            await Tracker.updateMany({ userEmail: email }, { $set: { userId: res._id } });

            //const token = GenerateToken(res);
            return new RegisterSuccess(true, {...res._doc, id: res._id/*, token*/});
        },

        /**
         * Login a user
         * @param {String} email
         * @param {String} password 
         */
        loginUser: async (_, { email, password }) => {
            // validateLogin is a simple func that checks for empty fields
            // and return valid = false if any.
            const { errors, valid } = validateLogin(email, password);
            if (!valid) return new UserInputError('LOGIN_ERROR', errors);

            // Check if that user already exists
            const user = await User.findOne({ email });
            if (!user) return new AuthenticationError('LOGIN_ERROR', [{ target: "email", message: AUTH_ERRORS.USER_NOT_EXISTS }]);

            // Check the password
            const match = await bcrypt.compare(password, user.password);
            if (!match) return new AuthenticationError('LOGIN_ERROR', [{ target: "password", message: AUTH_ERRORS.PASSWORD_INCORRECT }]);

            if(!user.isActive) return new AuthenticationError('LOGIN_ERROR', [{message: 'Your account has not been validated yet, please open the link receive on your mailbox.'}]);

            // Generate a token and return user info
            const token = GenerateToken(user);
            return new LoginSuccess(user._id, user._doc, `Bearer ${token}`);
        },

        /**
         * Update last connection in the database
         */
        updateLastConnection: async (_, { }, { auth }) => {
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

        /**
         * Delete an existing user
         * @param {String} userId
         */
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
        },

        /**
         * Activate an account
         * @param {String} userId 
         */
        activeAccount: async (_, { userId }) => {
            try {
                let user = await User.findById(userId);
                if (!user) return new OperationResult(false, 'ACCOUNT_ACTIVATION', 'No existing account');

                if (user.isActive) return new OperationResult(false, 'ACCOUNT_ACTIVATION', 'Account is already active!');

                let res = await User.updateOne(
                    { _id: user.id },
                    { $set: { isActive: true } },
                    { useFindAndModify: false }
                );
                if (res.n === 0) return new OperationResult(false, 'ACCOUNT_ACTIVATION', 'An error occurred');

                return new OperationResult(true, 'ACCOUNT_ACTIVATION');
            } catch (error) {
                //console.log(error.message);
                return new OperationResult(false, 'ACCOUNT_ACTIVATION', 'An error occurred, your account has not been activated');
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