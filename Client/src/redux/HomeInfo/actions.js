import { UPDATE_HOME_AIRPORT, UPDATE_HOME_TRACKERS, UPDATE_HOME_TRACKERS_STATUS, UPDATE_HOME_SINGLE_TRACKER } from './types';

export const updateNearestAirport = (nearestAirport) => {
    return {
            type: UPDATE_HOME_AIRPORT, nearestAirport
    };
};

export const updateNearestTrackers = (trackers, status) => {
    return {
        type: UPDATE_HOME_TRACKERS, trackers, status
    };
};

export const updateNearestTrackersStatus = (trackerId, status, error) => {
    return {
        type: UPDATE_HOME_TRACKERS_STATUS, trackerId, status, error
    }
}

export const updateSingleNearestTracker = (trackerId, tracker, status) => {
    return {
        type: UPDATE_HOME_SINGLE_TRACKER, trackerId, tracker, status
    };
}