import { UPDATE_AIRPORT, UPDATE_TRACKERS, UPDATE_SINGLE_TRACKER } from './types';

export const updateNearestAirport = (nearestAirport) => {
    return {
            type: UPDATE_AIRPORT, nearestAirport
    };
};

export const updateNearestTrackers = (command) => {
    return {
        type: UPDATE_TRACKERS, command
    };
};

export const updateSingleNearestTracker = (command) => {
    return {
        type: UPDATE_SINGLE_TRACKER, command
    };
}