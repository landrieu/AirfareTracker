import { Tracker } from '../../database/models/Tracker';

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