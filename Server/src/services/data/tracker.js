import { Tracker } from '../../database/models/Tracker';

export const getTrackers = async (filter, fields) => {
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