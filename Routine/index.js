import { mongo } from './database';
import { Tracker } from './database/models/Tracker';

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

};

const fetchAllActiveTrackers = () => {
    return Tracker.find({isActive: true});
};

const scanTracker = (tracker) => {
    let resultsBySource = [];
    let res;

    //Check is the tracker is valid dates etc, if not disable the tracker or not

    console.log(tracker);
    for(let i = 0; i < sources.length; i++){
        res = sources[i].scan(tracker);
        resultsBySource.push(res);
    }

    //Select the results to save or all of them

    return resultsBySource;
};

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
const scanAllTrackers = (trackers) => {
    let scanResults = [];
    let scanResult = null;

    trackers.forEach((tracker) => {
        scanResult = scanTracker(tracker);
    });

    return scanResults;
};

const saveAirfare = async (airfare) => {

};

const saveResults = async (results) => {
    let resTracker = null;

    for(let i = 0; i < results.length; i++){
        resTracker = results[i];

        for(let j = 0; j < resTracker.length; j++){
            saveAirfare();
        }
    }
};

const startRoutine = async() => {
    let success = await connectDb();
    if(!success) return false;

    let activeTrackers = await fetchAllActiveTrackers();
    console.log('a', activeTrackers.length);
    let scanResults = await scanAllTrackers([activeTrackers[0]]);

    //let savedResults = await saveResults(scanResults);
    //console.log('a', activeTrackers.length);
    //console.log('a', activeTrackers);
};



startRoutine();