import { mongo } from './database';
import { Tracker } from './database/models/Tracker';
import { Airfare } from './database/models/Airfare';
import { formatDate, listPossibleDates } from './helpers/date';

import sourcesAvailable from './sources';

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

const fetchActiveTrackers = (type) => {
    return Tracker.find({isActive: true, ...type});
};

const selectSources = (tracker) => {
    let sources = [];

    if(!tracker.sources || tracker.sources.length === 0) return sourcesAvailable;

    tracker.sources.forEach(source => {
        for(let i = 0; i < sourcesAvailable.length; i++){
            if(sourcesAvailable[i].id === source || sourcesAvailable[i].name === source){
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
    for(let i = 0; i < sources.length; i++){
        res = sources[i].scan(tracker);
        srcPromises.push(res);
    }

    return Promise.all(srcPromises).then((results) => {
        //Flat a possible array of array, then remove empty elements or empty arrays
        return results.reduce((acc, cur) => Array.isArray(cur) ? [...acc, ...cur] : [...acc, cur], [])
        .map(res => Object.assign({trackerId: tracker._id}, res));
    })
};

const scanAllSources = (tracker) => {
    let promises = [];
    let sources = selectSources(tracker);

    for(let i = 0; i < sources.length; i++){
        promises.push(sources[i].scan(tracker));
    }

    return promises;
};

const isTrackerDatesInFuture = (dates) => {
    for(let i = 0; i < dates.length; i++){
        if(new Date() > new Date(dates[i])){
            return false;
        }
    }
    return true;
};

const disableTracker = (tracker) => {
    return Tracker.findOneAndUpdate(
        {_id: tracker._id}, 
        {$set: {isActive: false}}, 
        {useFindAndModify: false}
    );
};

const scanTracker = async (tracker) => {
    let resultsBySource = [];
    let airfares, dates;

    if(tracker.type === 'F'){
        dates = defineDatesFrequentTracker(tracker.occurrences);
    }else{
        if(!isTrackerDatesInFuture(tracker.startDates)){
            //Disable tracker
            await disableTracker();
            return [];
        }
        dates = listPossibleDates(tracker.startDates, tracker.endDates);
    }

    /*for(let i = 0; i < dates.length; i++){
        //trackerDates = {startDate: dates[i].startDate, endDate: dates[i].endDate};
        airfares = await scanTrackerWithSources(Object.assign({}, tracker._doc, dates[i]));
        resultsBySource.push(...airfares);
    }*/

    /**
     * Second option
     * Must return a promise all
     */
    let allPromises = [];
    for(let i = 0; i < dates.length; i++){
        //trackerDates = {startDate: dates[i].startDate, endDate: dates[i].endDate};
        allPromises.push(...scanAllSources(Object.assign({}, tracker._doc, dates[i])));
    }

    return Promise.all(allPromises).then(airfares => airfares.filter(airfare => airfare));

    //Check is the tracker is valid dates etc, if not disable the tracker or not

    //Select the results to save or all of them
    //console.log(resultsBySource);

    return resultsBySource;
};
/**
 * [{
 *     interval: 'nL' // 1y depart in 1 year
 *     length: 'nL' // 1w return in 1 year and 1 week
 *  }
 * 
 * ]
 * nL => n is a number, and L a unit of time (w => week, m => month, y => year)
 * @param {*} occurences 
 */
export const defineDatesFrequentTracker = (occurences) => {
    let dates = [];
    let today = new Date();
    let startDelay, lengthTrip;

    const getNumber = (d) => {
        let n = d.match(/^\d+/g); 
        return n.length > 0 ? n[0] : null;
    };

    const getUnit = (d) => {
        return d[d.length - 1];
    };

    const computeDate = (d, n, u) => {
        let date = new Date(d);
        if(u === 'y'){
            return date.addYears(n);
        }else if (u === 'm'){
            return date.addMonths(n);
        }else if (u === 'w'){
            return date.addWeeks(n);
        }else console.log(`Unit not recognized: ${u}`);

        return null;
    };

    const defineDate = (d, dateUnit) => {
        const n = getNumber(dateUnit); //Number
        const u = getUnit(dateUnit); //Unit of time
        return computeDate(d, n, u);
    };

    for(let occurrence of occurences){
        startDelay = occurrence.interval;
        lengthTrip = occurrence.length;

        let startDate = formatDate(defineDate(today, startDelay), 'YYYYMMDD');
        let endDate = formatDate(defineDate(startDate, lengthTrip), 'YYYYMMDD');

        if(!startDate || !endDate) continue;
        dates.push({startDate, endDate, occurrence});
    }

    return dates;
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

const startRoutine = async(dbFilter) => {
    console.log(`Date: ${formatDate(new Date(), 'DDMMYYYYHHMMSS')}`);
    console.log(`Start routine, type: ${dbFilter.type}`);
    console.time('Routine execution');

    let success = await connectDb();
    if(!success) return false;

    let activeTrackers = await fetchActiveTrackers(dbFilter);
    console.log(`Number of active trackers ${activeTrackers.length}`);

    if(activeTrackers.length === 0){
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

function eFlags(args){
    let flags = {};
    for(let i = 0; i < args.length; i++){
        if(/^-/.test(args[i]) && args[i + 1]){
            flags[args[i].replace('-', '')] = args[i + 1];
            i++;
        }
    }
    return flags;
}

function start(){
    const args = process.argv.slice(2);
    const flags = eFlags(args);
    const tFlag = flags.t || '';
    //console.log(`Arguments ${args}`);

    /*Three possible types 
      - A - Scan all the trackers - Default value
      - N - Scan the trackers saved by users
      - F - Scan the frequent routes
    */
    const possibleTypes = ['A', 'N', 'F'];
    let type = (tFlag && (possibleTypes.indexOf(tFlag) !== -1)) ? tFlag : 'F';

    startRoutine(['N', 'F'].indexOf(type) !== - 1 ? {type}: {});
}

start();