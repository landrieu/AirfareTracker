import { mongo } from './database';
import { Tracker } from './database/models/Tracker';
import { Airfare } from './database/models/Airfare';

import sources from './sources';

const connectDb = async () => {
    let success = true;
    try{
        await mongo.connect();
    }catch(err){
        console.log(`Database connection issue: ${err}`);
        success = false;
    }

    return success;
};

const disconnectDb = async () => {
    await mongo.disconnect();
    console.log("Database disconnected");
};

const fetchAllActiveTrackers = () => {
    return Tracker.find({isActive: true});
};

const listPossibleDates = (startDates, endDates) => {
    return startDates.map(startDate => endDates.map(endDate => {startDate, endDate}))
    .reduce((acc, val) => [...acc, ...val], []);
}

const scanTrackerWithSources = (tracker) => {
    let srcPromises = [], res;

    for(let i = 0; i < sources.length; i++){
        res = sources[i].scan(tracker);
        srcPromises.push(res);
    }

    return Promise.all(srcPromises).then((results) => results.map(res => Object.assign({}, res, {trackerId: tracker._id})));
};

const scanTracker = async (tracker) => {
    let resultsBySource = [];
    let airfares, trackerDates;
    let dates = listPossibleDates(tracker.startDates, tracker.endDates);

    for(let i = 0; i < dates.length; i++){
        trackerDates = {startDate: dates[i].startDate, endDate: dates[i].endDate};
        airfares = await scanTrackerWithSources(Object.assign({}, tracker._doc, trackerDates));

        resultsBySource.push(...airfares);
    }

    //Check is the tracker is valid dates etc, if not disable the tracker or not

    //Select the results to save or all of them

    return resultsBySource;
};

const saveAirfares = (airfares) => {
    let airfaresToSave = [];

    for(let airfare of airfares){
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

    for(let tracker of trackers){
        scanResults.push(... await scanTracker(tracker));
    }

    return scanResults;
};

const startRoutine = async() => {
    let success = await connectDb();
    if(!success) return false;

    let activeTrackers = await fetchAllActiveTrackers();
    console.log(`Number of active trackers ${activeTrackers.length}`);
    if(activeTrackers.length === 0) return false;

    let scanResults = await scanAllTrackers(activeTrackers.slice(0,2));

    let saveResults = await saveAirfares(scanResults);

    disconnectDb();
};

startRoutine();