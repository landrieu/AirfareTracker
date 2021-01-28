import { Tracker } from '../../database/models/Tracker';
import { VerifyAuthentication } from '../helpers/authentication';
import { NB_TRACKERS_PER_USER } from '../constants';

import { TrackerCreationCheck } from '../../classes/RequestOperation';

import { AUTH_ERRORS } from '../constants/errors';

const roles = {
    admin: "ADMIN",
    user: "USER"
};

/**
 * Validate user registration
 * @param {String} email 
 * @param {String} password 
 */
export const validateRegister = (email, password) => {
    let errors = [];

    if (!/\S+@\S+\.\S+/.test(email)) errors.push({ target: 'email', message: AUTH_ERRORS.EMAIL_FORMAT_INVALID });

    if (password.length < 6) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_LENGTH_SHORT });
    if (password.length > 20) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_LENGTH_LONG });
    if (!/^[A-Za-z0-9_@./#&+-]*$/.test(password)) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_INVALID_CHAR });

    return { valid: errors.length === 0, errors };
}

/**
 * Validate login
 * @param {String} email 
 * @param {String} password 
 */
export const validateLogin = (email, password) => {
    let errors = [];

    if (!/\S+@\S+\.\S+/.test(email)) errors.push({ target: 'email', message: AUTH_ERRORS.EMAIL_FORMAT_INVALID });

    if (password.length < 6) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_LENGTH_SHORT });
    if (password.length > 20) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_LENGTH_LONG });
    if (!/^[A-Za-z0-9_@./#&+-]*$/.test(password)) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_INVALID_CHAR });

    return { valid: errors.length === 0, errors };
}

/**
 * Check if a user can create a tracker
 * @param {Object} user 
 * @param {Object} auth 
 * @param {String} email 
 */
export const canCreateOrActivateTracker = async (user, auth, email) => {
    let userEmail, userId;

    //Try to fetch user is auth
    //Otherwise check email

    if (user) {
        //Admin can create trackers in any case
        if (user.role === roles.admin) return new TrackerCreationCheck(true, true, null, null);
        userId = user.id;
        userEmail = user.email;
    } else if (!user && auth) {
        try {
            user = await VerifyAuthentication(auth);
            if (user.role === roles.admin) return new TrackerCreationCheck(true, true, null, null);
            userId = user.id;
            userEmail = user.email;

        } catch (e) {
            //Not auth or auth issue
            //User not logged
            if (!email) return new TrackerCreationCheck(false, false, null, 'Must be logged');
            userEmail = email;
        }
    } else if (email) {
        userEmail = email;
    } else {
        return new TrackerCreationCheck(false, false, null, 'Must be logged');
    }

    let userSelector = userId ? { $or: [{ userId }, { userEmail }] } : { userEmail };
    let nbTrackersCreated = await Tracker.countDocuments({ $and: [{isActive: true}, userSelector]});
    let nbTrackersCreatable = (user ? NB_TRACKERS_PER_USER.REGISTERED : NB_TRACKERS_PER_USER.VISITOR) - nbTrackersCreated;
    
    return new TrackerCreationCheck(true, nbTrackersCreatable > 0, nbTrackersCreated, null);
};