import { UPDATE_HOME_AIRPORT, UPDATE_HOME_TRACKERS, UPDATE_HOME_TRACKERS_STATUS, UPDATE_HOME_SINGLE_TRACKER } from './types';
import { TRACKER_STATUS } from '../../services/appConstant';

const INITIAL_STATE = {
    nearestAirport: { updatedAt: null, airport: null },
    nearestTrackers: (new Array(6)).fill({ status: TRACKER_STATUS.INACTIVE, error: '' })
};

const reducer = (state = INITIAL_STATE, action) => {
    let trackers;

    switch (action.type) {
        case UPDATE_HOME_AIRPORT:
            return {
                ...state,
                nearestAirport: {
                    updatedAt: new Date(),
                    airport: action.nearestAirport
                }
            };

        case UPDATE_HOME_TRACKERS:
            trackers = action.trackers.map((t) => ({ ...t, status: action.status }));
            return { ...state, nearestTrackers: trackers }

        case UPDATE_HOME_TRACKERS_STATUS:
            trackers = state.nearestTrackers;
            if (action.trackerId) {
                trackers = trackers.map((t) => {
                    if (t === action.trackerId) return { ...t, status: action.status, error: action.error };
                    return t;
                });
            } else {
                trackers = trackers.map((t) => ({ ...t, status: action.status, error: action.error }));
            }
            return { ...state, nearestTrackers: trackers };

        case UPDATE_HOME_SINGLE_TRACKER:
            console.log(action.tracker);
            return {
                ...state,
                nearestTrackers: state.nearestTrackers.map(t => (t.id === action.trackerId) ? {...t, airfares: action.tracker.airfares, stats: action.tracker.stats, status: action.status } : t)
            };

        default: return state;
    }
};

/*
const updateTrackersReducer = (trackers, { updateType, trackerId, data }) => {
    switch (updateType) {
        case TRACKER_STATUS.INIT:
            return data.map(el => ({ ...el, status: TRACKER_STATUS.INIT }));

        case 'status':
            if (trackerId) return trackers.map(el => (el.id === trackerId ? { ...el, ...data } : el));
            else return trackers.map(el => ({ ...el, ...data }));

        case TRACKER_STATUS.COMPLETE:
            return trackers.map(el => {
                if (el.id === trackerId) return { ...el, airfares: data.airfares, stats: data.stats, status: TRACKER_STATUS.COMPLETE };
                else return { ...el, status: TRACKER_STATUS.COMPLETE }
            });

        default: console.log(`Update type not recognized: ${updateType}`);
            break;
    }
}*/

export default reducer;