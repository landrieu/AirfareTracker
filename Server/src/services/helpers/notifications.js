import { Airport } from '../../database/models/Airport';
import { Email } from '../../services/email';

import { BASE_URL } from '../../services/settings';

import moment from 'moment';

/**
 * Send notification for tracker creation
 * @param {Object} sTracker Tracker created
 * @param {Object} tracker Tracker info
 * @param {String} userEmail 
 */
export const sendNewTrackerEmail = (sTracker, tracker, userEmail) => {
    return new Promise(async (resolve) => {
        let fromAirport = await Airport.findOne({ iataCode: tracker.from });
        let toAirport = await Airport.findOne({ iataCode: tracker.to });
        let content = {
            trackerId: sTracker._id,
            trackerLink: `${BASE_URL}/tracker/${sTracker._id}`,
            from: fromAirport.city,
            to: toAirport.city,
            departureDates: `${moment(tracker.startDates[0]).format('dddd DD MMMM YYYY')} - ${moment(tracker.startDates[tracker.startDates.length - 1]).format('dddd DD MMMM YYYY')}`,
            returnDates: `${moment(tracker.endDates[0]).format('dddd DD MMMM YYYY')} - ${moment(tracker.endDates[tracker.endDates.length - 1]).format('dddd DD MMMM YYYY')}`,
        };

        let email = new Email(userEmail, 'Airfare tracker - New tracker', content, 'template_tracker_creation');
        let resEmail = await email.send();
        if (resEmail.rejected.length > 0){
            console.log('Email not sent');
            resolve(false);
        } 

        resolve(true);
    });
};

/**
 * Send an email after registration
 * @param {String} userId 
 * @param {String} userEmail 
 */
export const sendRegistrationEmail = (userId, userEmail) => {
    return new Promise(async (resolve) => {
        let content = {
            activationLink: `${BASE_URL}/activation/${userId}`,
        };
        let activationEmail = new Email(userEmail, 'Airfare tracker - Registration', content, 'template_registration');
        let resEmail = await activationEmail.send();
        if (resEmail.rejected.length > 0){
            console.log('Email not sent');
            resolve(false);
        } 

        resolve(true);
    });
};