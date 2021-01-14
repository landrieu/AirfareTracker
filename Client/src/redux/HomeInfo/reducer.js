import { UPDATE_HOME_AIRPORT, UPDATE_HOME_TRACKERS, UPDATE_HOME_TRACKERS_STATUS, UPDATE_HOME_SINGLE_TRACKER } from './types';
import { TRACKER_STATUS } from '../../services/constants';

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
            return {
                ...state,
                nearestTrackers: state.nearestTrackers.map(t => (t.id === action.trackerId) ? {...t, airfares: action.tracker.airfares, stats: action.tracker.stats, status: action.status } : t)
            };

        default: return state;
    }
};

export default reducer;