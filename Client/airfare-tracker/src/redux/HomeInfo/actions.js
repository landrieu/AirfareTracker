import { UPDATE_AIRPORT, UPDATE_TRACKERS } from './types';

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