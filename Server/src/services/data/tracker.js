import { Tracker } from '../../database/models/Tracker';
import { FrequentTrackerOccurrences } from '../constants';

export const findTrackers = (filter, fields) => {
	return Tracker.find(filter, fields);
};

export const randomTrackers = (nbTrackers = 6) => {
    return Tracker.aggregate([
        { $sample: { size: nbTrackers }} 
    ]);
}

export const randomTrackersIDs = async () => {
    let trackers = await randomTrackers();
    return trackers.map(t => t._id);
}

export const listFrequentTrackersAirports = async() => {
	let res = await Tracker.aggregate([
		{ $match: { 	
			$and: [
				{ type : "F" }, 
				{ isActive: true }
			]
		}},
		{
			$group: {
				_id: 0,
				iataCodesFrom: {$addToSet: "$from"},
				iataCodesTo: {$addToSet: "$to"}
			}
		},{
			$project: {
				iatas: { $setUnion: ["$iataCodesFrom", "$iataCodesTo"]}
			}
		}
	]);
	return res.length > 0 ? res[0].iatas : null;
}

export const aggregateTrackerAirport = async (filter) => {
    return Tracker.aggregate([
        { $match : filter},
        {
            $lookup:{
              from: "airports",
              localField: "from",
              foreignField: "iataCode",
              as: "airportInfoFrom"
            }
       },{
            $lookup:{
                from: "airports",
                localField: "to",
                foreignField: "iataCode",
                as: "airportInfoTo"
            }
        }
     ]);
} 

export const formatFrequentTracker = (tr) => {
    let tracker = {
        ...tr,
        occurrences: tr.occurrences || FrequentTrackerOccurrences,
        isActive: true, 
        type: 'F'
    }
    
    return tracker;
}

export const formatNormalTracker = (tr, userId, userEmail) => {
    const formatDates = (dateMin, dateMax) => {
        let listDates = [dateMin.clone()];
        let cDate = dateMin, tDate;

        while(cDate < dateMax){
            tDate = cDate.addDays(1).clone();
            listDates.push(tDate);
        }

        return listDates;
    };

    let tracker = {
        ...tr,
        startDates: formatDates(new Date(tr.startDates[0]), new Date(tr.startDates[1])),
        endDates: formatDates(new Date(tr.endDates[0]), new Date(tr.endDates[1])),
        isActive: true,  
        isAlertActive: !!tr.triggerPrice, 
        type: 'N', 
        userId, 
        userEmail, 
        sources: ["5dc39bba581d45d4af0f7f5fc46701d2"], 
    };

    return tracker;
}