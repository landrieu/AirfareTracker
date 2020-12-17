import { Airport } from '../database/models/Airport';
import { Airfare } from '../database/models/Airfare';

import { TERMS_TYPES } from '../services/constants';

import _ from '../services/helpers/date';

module.exports = {
    Query: {
        airfares:() => {
            return Airfare.find();
        },
        airfaresByTrackerId: async (_, {trackerId}) => {
            const query = {trackerId};
            let airfares = await Airfare.find(query);
            //console.log(airfares);
            let occurrencesMap = new Map();

            let key, existingMap;
            airfares.forEach(airfare => {
                key = `${airfare.occurrence.interval}${airfare.occurrence.length}`;
                if(occurrencesMap.has(key)){
                    existingMap = occurrencesMap.get(key);
                    occurrencesMap.set(key, {occurrence: existingMap.occurrence, airfares: [...existingMap.airfares, airfare]})
                }else{
                    occurrencesMap.set(key, {occurrence: airfare.occurrence, airfares: []})
                }
            });
            //console.log(occurrencesMap)
            let airfaresByTerms = new Map();
            occurrencesMap.forEach((value, key) => {
                let projDate = determineOccLength(value.occurrence);
                let term = determineTerm(projDate);
                airfaresByTerms.has(term) ? 
                airfaresByTerms.set(term, [...airfaresByTerms.get(term), ...value.airfares]) :
                airfaresByTerms.set(term, value.airfares);
            })

            let airfaresRes = mergeAirfares(airfaresByTerms);
            //Determine short - medium - long term, then merge mapsl
            return airfaresRes;
        },
        airfaresNumber: (_ , {trackerId}) => {
            return Airfare.count(trackerId ? {trackerId} : {}).then(res => ({n: res}));
        }
    },
    Mutation: {
        
    },
    Airfare: {
        /**
         * Return trackers associated to a user
         * @param {Object} tracker 
         */
        from(airfare) {
            return Airport.findOne({"iataCode": airfare.from});
        },
        to(airfare) {
            return Airport.findOne({"iataCode": airfare.to});
        }
    }
}

function mergeAirfares(airfaresByTerms, timeGap = (1000 * 60 * 5)/*In ms*/){
    let airfares = [];
    let airfaresMerged = [];
    airfaresByTerms.forEach((_, key) => {
        airfaresMerged = [];
        //Sort by creation date
        airfaresByTerms.get(key).sort((a, b) => a.createdAt - b.createdAt);
        let airfaresToMerge = airfaresByTerms.get(key);
        let i, j;
        //Merge record i with following if creation time difference below the time gap
        for(i = 0; i < airfaresToMerge.length; i++){
            let recToMerge = [airfaresToMerge[i]];
            for(j = i + 1; j < airfaresToMerge.length; j++){
                if(new Date(airfaresToMerge[j].createdAt) - new Date(airfaresToMerge[i].createdAt) > timeGap) break;
                else{
                    recToMerge.push(airfaresToMerge[j]);
                }
            }
            
            i = j - 1;
            airfaresMerged.push(reduceAirfares(recToMerge));
        } 
        airfares.push({term: key, data: airfaresMerged});
    });

    return airfares;
}

function reduceAirfares(airfares){
    let nbAirfaresToMerge = airfares.length;
    return airfares.reduce((acc,cur) => {
        if(!acc){
            return {
                trackerId:      cur.trackerId,
                from:           cur.from,
                to:             cur.to,
                maxPrice:       cur.maxPrice,
                minPrice:       cur.minPrice,
                averagePrice:   cur.averagePrice / nbAirfaresToMerge,
                medianPrice:    cur.medianPrice / nbAirfaresToMerge,
                nbResults:      cur.nbResults,
                nbAirfares:     nbAirfaresToMerge,
                createdAt:      cur.createdAt
            };
        } 

        return {
            ...acc,
            maxPrice:       Math.max(acc.maxPrice, cur.maxPrice),
            minPrice:       Math.min(acc.minPrice, cur.minPrice),
            averagePrice:   acc.averagePrice + (cur.averagePrice / nbAirfaresToMerge),
            medianPrice:    acc.medianPrice + (cur.medianPrice / nbAirfaresToMerge),
            nbResults:      acc.nbResults + cur.nbResults,
        };
    }, null);
}

function determineOccLength({interval}){
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

    let gapDate = new Date();
    let unit = getUnit(interval);
    let number = getNumber(interval);
    return computeDate(gapDate, number, unit);
}

function determineTerm(date){
    let sTerm = (new Date()).addMonths(2);
    let mTerm = (new Date()).addMonths(5);

    if(date < sTerm) return TERMS_TYPES.shortTerm;
    if(date < mTerm) return TERMS_TYPES.mediumTerm;
    return TERMS_TYPES.longTerm
}