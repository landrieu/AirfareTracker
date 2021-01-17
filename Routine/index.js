import { ObjectID } from 'mongodb';

import { mongo } from './database';
import { Tracker } from './database/models/Tracker';
import { Airfare } from './database/models/Airfare';
import { User } from './database/models/User';
import { Airport } from './database/models/Airport';
import { formatDate, listPossibleDates, defineDatesFrequentTracker, areDatesInFuture } from './helpers/date';

import { Email } from './helpers/email';
import sourcesAvailable from './sources';

const connectDb = async () => {
    let success = true;
    try {
        await mongo.connect();
    } catch (err) {
        console.log(`Database connection issue: ${err}`);
        success = false;
    }

    return success;
};

const disconnectDb = async () => {
    await mongo.disconnect();
    console.log("Database disconnected");
};

const fetchActiveTrackers = (type) => {
    return Tracker.find({ isActive: true, ...type });
};

const selectSources = (tracker) => {
    let sources = [];

    if (!tracker.sources || tracker.sources.length === 0) return sourcesAvailable;

    tracker.sources.forEach(source => {
        for (let i = 0; i < sourcesAvailable.length; i++) {
            if (sourcesAvailable[i].id === source || sourcesAvailable[i].name === source) {
                sources.push(sourcesAvailable[i]);
                break;
            }
        }
    });

    return sources;
}

const scanTrackerWithSources = (tracker) => {
    let srcPromises = [], res;

    let sources = selectSources(tracker);
    for (let i = 0; i < sources.length; i++) {
        res = sources[i].scan(tracker);
        srcPromises.push(res);
    }

    return Promise.all(srcPromises).then((results) => {
        //Flat a possible array of array, then remove empty elements or empty arrays
        return results.reduce((acc, cur) => Array.isArray(cur) ? [...acc, ...cur] : [...acc, cur], [])
            .map(res => Object.assign({ trackerId: tracker._id }, res));
    })
};

const scanAllSources = (tracker) => {
    let promises = [];
    let sources = selectSources(tracker);

    for (let i = 0; i < sources.length; i++) {
        promises.push(sources[i].scan(tracker));
    }

    return promises;
};


const disableTracker = (tracker) => {
    return Tracker.findOneAndUpdate(
        { _id: tracker._id },
        { $set: { isActive: false } },
        { useFindAndModify: false }
    );
};

const scanTracker = async (tracker) => {
    let dates;

    if (tracker.type === TRACKER_TYPES.FREQUENT) {
        dates = defineDatesFrequentTracker(tracker.occurrences);
    } else if (tracker.type === TRACKER_TYPES.NORMAL) {
        if (areDatesInFuture(tracker.startDates)) {
            //Disable tracker
            await disableTracker(tracker);
            return [];
        }
        dates = listPossibleDates(tracker.startDates, tracker.endDates);
    } else {
        console.log(`Unkbown tracker type ${tracker.type}`);
        return
    }

    /**
     * Second option
     * Must return a promise all
     */
    let allPromises = [];
    for (let i = 0; i < dates.length; i++) {
        allPromises.push(...scanAllSources(Object.assign({}, tracker._doc, dates[i])));
    }

    return Promise.all(allPromises)
        //Eliminate empty results
        .then(airfares => airfares.filter(airfare => airfare))
        //Merge result and tracker id
        .then(airfares => airfares.map(res => ({ ...res, trackerId: tracker._id })))
        //Check if alert can be sent
        .then(async (airfares) => {
            try {
                await checkAlert(tracker, airfares);
            } catch (error) {
                console.log(`Unexpected error: ${error.message}`);
            }

            return airfares;
        });

    //Check is the tracker is valid dates etc, if not disable the tracker or not

    //Select the results to save or all of them
};


const saveAirfares = (airfares) => {
    let airfaresToSave = [];

    for (let airfare of airfares) {
        console.log(`Save: ${airfare.from} - ${airfare.to}  ${airfare.startDate} - ${airfare.endDate} -> ${airfare.minPrice}`);
        airfaresToSave.push(new Airfare(airfare));
    }

    return Airfare.insertMany(airfaresToSave);
}

/**
 * {
 *    success: true|false,
 *    message: String,
 *    sourceId: String,
 *    data: [
 *       {
 *          from: PAR
 *          to: NYC
 *          startDate: 
 *          endDate:
 *          Among the 20th best prices
 *          minPrice:
 *          maxPrice:
 *          medianPrice:
 *          averagePrice:
 *          range: (max - min)
 *          nbResults
 *       }
 *    ]
 * }
 * @param {*} trackers 
 */
const scanAllTrackers = async (trackers) => {
    let scanResults = [];

    for (let tracker of trackers) {
        scanResults.push(... await scanTracker(tracker));
    }

    return scanResults;
};

const checkAlert = (tracker, airfares) => {

    if (tracker.type !== TRACKER_TYPES.NORMAL) return;
    if (!tracker.isAlertActive || tracker.triggerPrice === undefined || tracker.triggerPrice === 0) return;

    let airfaresUnderTrigger = [];

    for (let airfare of airfares) {
        if (airfare.minPrice < tracker.triggerPrice) airfaresUnderTrigger.push(airfare);
    }

    if (airfaresUnderTrigger.length > 0) return sendAlert(tracker, airfaresUnderTrigger);
};

const sendAlert = ({ id, from, to, userId, userEmail, triggerPrice }, airfares) => {
    return new Promise(async (resolve, reject) => {
        //Find user email from the user details
        if (!userEmail && userId) {
            let user = await User.findById(userId);
            if (user.email) userEmail = user.email;
            else throw new Error('No user found');
        } else if (!userEmail && !userId) {
            throw new Error('No user found');
        }
        return resolve(userEmail);
    }).then(async (recipient) => {
        console.log(`Send alert email to: ${recipient}`);
        let fromAirport = await Airport.findOne({ iataCode: from });
        let toAirport = await Airport.findOne({ iataCode: to });
        let emailContent = {
            from: fromAirport.city,
            to: toAirport.city,
            triggerPrice
        };
        let details = '';
        for (let airfare of airfares) {
            details += `<li>${formatDate(airfare.startDate, 'DDMMYYYY')} - ${formatDate(airfare.endDate, 'DDMMYYYY')}, price detected: ${airfare.minPrice}</li>`;
        }
        emailContent.details = details;

        let email = new Email(recipient, 'An airfare has been detected!', emailContent, 'template_alert');
        return email.send();
    }).then(() => {
        //Disable the alert
        return Tracker.updateOne({_id: ObjectID(id)}, {isActive: false});
    })
};

const startRoutine = async (dbFilter) => {
    console.log(`Date: ${formatDate(new Date(), 'DDMMYYYYHHMMSS')}`);
    console.log(`Start routine, type: ${dbFilter.type}`);
    console.time('Routine execution');

    let success = await connectDb();
    if (!success) return false;

    let activeTrackers = await fetchActiveTrackers(dbFilter);
    console.log(`Number of active trackers ${activeTrackers.length}`);

    if (activeTrackers.length === 0) {
        console.log('No active trackers, exit!');
        await disconnectDb();
        console.timeEnd('Routine execution');
        return;
    }

    let scanResults = await scanAllTrackers(activeTrackers);

    let saveResults = await saveAirfares(scanResults);
    console.log(`Number of airfares saved ${saveResults.length}.`);

    await disconnectDb();
    console.timeEnd('Routine execution');
};

function eFlags(args) {
    let flags = {};
    for (let i = 0; i < args.length; i++) {
        if (/^-/.test(args[i]) && args[i + 1]) {
            flags[args[i].replace('-', '')] = args[i + 1];
            i++;
        }
    }
    return flags;
}

function start() {
    const args = process.argv.slice(2);
    const flags = eFlags(args);
    const tFlag = flags.t || '';
    //console.log(`Arguments ${args}`);

    /*Three possible types 
      - A - Scan all the trackers - Default value
      - N - Scan the trackers saved by users
      - F - Scan the frequent routes
    */
    const possibleTypes = Object.values(TRACKER_TYPES);
    let type = (tFlag && (possibleTypes.indexOf(tFlag) !== -1)) ? tFlag : TRACKER_TYPES.FREQUENT;

    startRoutine([TRACKER_TYPES.FREQUENT, TRACKER_TYPES.NORMAL].indexOf(type) !== - 1 ? { type } : {});
}

const TRACKER_TYPES = {
    FREQUENT: 'F',
    NORMAL: 'N',
    ALL: 'A'
}

start();