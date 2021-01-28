import { TERMS_TYPES } from '../constants';
import { areDatesOnSameDay } from '../helpers/date';

/**
 * Group airfares by terms (short, medium and long)
 * Then merge by creation date
 * @param {Array} airfares Array of airfares
 */
export const groupAndMergedAirfares = (airfares) => {
    let airfaresPerTerms = groupAirfaresByTerms(airfares);

    let mergedAirfares = mergeAirfaresPerCreationDate(airfaresPerTerms);

    return mergedAirfares;
}

/**
 * Group airfares by terms
 * @param {Array} airfares 
 */
export const groupAirfaresByTerms = (airfares) => {
    let occurenceTermMap = new Map();
    let airfareTermMap = new Map();
    let key, curTerm;

    airfares.forEach((airfare) => {
        key = `${airfare.occurrence.interval}${airfare.occurrence.length}`;
        //Determine if the airfare's term
        if (occurenceTermMap.has(key)) {
            curTerm = occurenceTermMap.get(key);
        } else {
            curTerm = determineTerm(airfare.occurrence);
            occurenceTermMap.set(key, curTerm);
        }

        //Then store with same term airfares
        if (airfareTermMap.has(curTerm)) {
            airfareTermMap.set(curTerm, [...airfareTermMap.get(curTerm), airfare]);
        } else {
            airfareTermMap.set(curTerm, [airfare]);
        }
    });

    return airfareTermMap;
}

/**
 * Merge airfares by creation date
 * @param {Array} airfaresByTerms 
 * @param {Number} timeGap 
 */
export const mergeAirfaresPerCreationDate = (airfaresByTerms, timeGap = (1000 * 60 * 5)/*In ms*/) => {
    let airfares = [];
    let airfaresMerged = [];
    airfaresByTerms.forEach((_, key) => {
        airfaresMerged = [];
        //Sort by creation date
        let airfaresToMerge = airfaresByTerms.get(key).sort((a, b) => a.createdAt - b.createdAt);
        let i, j;
        //Merge record i with following if creation time difference below the time gap
        for (i = 0; i < airfaresToMerge.length; i++) {
            let recToMerge = [airfaresToMerge[i]];
            for (j = i + 1; j < airfaresToMerge.length; j++) {
                if (new Date(airfaresToMerge[j].createdAt) - new Date(airfaresToMerge[i].createdAt) > timeGap) break;
                else {
                    recToMerge.push(airfaresToMerge[j]);
                }
            }

            i = j - 1;
            airfaresMerged.push(reduceAirfares(recToMerge));
        }
        airfares.push({ term: key, data: airfaresMerged });
    });

    return airfares;
}

/**
 * Reduce array of airfares into a single record
 * @param {Array} airfares 
 */
export const reduceAirfares = (airfares) => {
    let nbAirfaresToMerge = airfares.length;
    return airfares.reduce((acc, cur) => {
        if (!acc) {
            return {
                trackerId: cur.trackerId,
                from: cur.from,
                to: cur.to,
                maxPrice: cur.maxPrice,
                minPrice: cur.minPrice,
                averagePrice: cur.averagePrice / nbAirfaresToMerge,
                medianPrice: cur.medianPrice / nbAirfaresToMerge,
                nbResults: cur.nbResults,
                nbAirfares: nbAirfaresToMerge,
                createdAt: cur.createdAt
            };
        }

        return {
            ...acc,
            maxPrice: Math.max(acc.maxPrice, cur.maxPrice),
            minPrice: Math.min(acc.minPrice, cur.minPrice),
            averagePrice: acc.averagePrice + (cur.averagePrice / nbAirfaresToMerge),
            medianPrice: acc.medianPrice + (cur.medianPrice / nbAirfaresToMerge),
            nbResults: acc.nbResults + cur.nbResults,
        };
    }, null);
}

/**
 * Compute evolution of airfares along the last ...
 * @param {*} airfares 
 */
export const computeStats = (airfares) => {
    if (airfares.length === 0) return null;

    let stats = [];
    const extractSameDayRecords = (refDate, airfares) => {
        let sameDayAirfares = [];
        for (let i = 0; i < airfares.length; i++) {
            if (areDatesOnSameDay(airfares[i].createdAt, refDate)) {
                sameDayAirfares.push(airfares[i]);
            } else if (sameDayAirfares.length !== 0) {
                break;
            };
        }
        return sameDayAirfares;
    };

    const computeAvgTimeRef = (refDate, airfares) => {
        //Extract airfares that have same date than the reference
        let refDateAirfares = extractSameDayRecords(refDate, airfares);
        if (refDateAirfares.length === 0) return null;
        //Compute the average
        return refDateAirfares.reduce((acc, airfare, _, arr) => (acc + (airfare.averagePrice / arr.length)), 0);
    };

    const computeAirfaresEvolution = (refDate, airfares, avgAirfaresInit, label) => {
        let avgAirfaresRefDate = computeAvgTimeRef(refDate, airfares);
        let evolution = avgAirfaresRefDate ? (((avgAirfaresInit * 100) / avgAirfaresRefDate) - 100).rounding(2) : null;
        return evolution ? {text: label, value: evolution > 0 ? `+${evolution}%` : `${evolution}%` } : null
    }

    //Sort airfares from most recent to older
    airfares.sort((a, b) => b.createdAt - a.createdAt);

    //Get date of 24hrs and 1week before the last update
    //Last update reference
    let lastUpdate = airfares[0].createdAt;
    let avgLastUpdate = computeAvgTimeRef(lastUpdate, airfares);

    //Evolution last 24hrs
    let h24Before = lastUpdate.clone().addDays(-1);
    let h24Evolution = computeAirfaresEvolution(h24Before, airfares, avgLastUpdate, 'Evolution last 24hrs:');
    if(h24Evolution) stats.push(h24Evolution);

    //Evolution last week
    let w1Before = lastUpdate.clone().addWeeks(-1);
    let w1Evolution = computeAirfaresEvolution(w1Before, airfares, avgLastUpdate, 'Evolution last week:');
    if(w1Evolution) stats.push(w1Evolution);

    let standardDeviation = computeStandardDeviation(airfares.map(a => a.averagePrice));
    if(standardDeviation) stats.push({text: 'Standard deviation', value: standardDeviation.rounding(2)});

    return stats;
}

function determineProjectionDate({ interval }) {
    const getNumber = (d) => {
        let n = d.match(/^\d+/g);
        return n.length > 0 ? n[0] : null;
    };

    const getUnit = (d) => {
        return d[d.length - 1];
    };

    const computeDate = (d, n, u) => {
        let date = new Date(d);
        if (u === 'y') {
            return date.addYears(n);
        } else if (u === 'm') {
            return date.addMonths(n);
        } else if (u === 'w') {
            return date.addWeeks(n);
        } else console.log(`Unit not recognized: ${u}`);

        return null;
    };

    let gapDate = new Date();
    let unit = getUnit(interval);
    let number = getNumber(interval);
    return computeDate(gapDate, number, unit);
}

/**
 * Determine the term (short, medium or long)
 * Departure below 2 months -> Short
 * Departure above 2 months but below 5 months -> Medium
 * Departure above 5 months -> Long
 * @param {Object} occurence 
 */
function determineTerm(occurence) {
    let projDate = determineProjectionDate(occurence);

    let sTerm = (new Date()).addMonths(2);
    let mTerm = (new Date()).addMonths(5);

    if (projDate < sTerm) return TERMS_TYPES.shortTerm;
    if (projDate < mTerm) return TERMS_TYPES.mediumTerm;
    return TERMS_TYPES.longTerm;
}
/**
 * 
 * @param {Array[Number]} n 
 */
export const computeStandardDeviation = (n) => {
    const avg = n.reduce((acc, cur, _, arr) => acc + (cur / arr.length), 0);
    const squareSum = n.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0);
    const standardVariance = Math.pow(squareSum / n.length, (1/2));

    return standardVariance;
}

//Compute distribution