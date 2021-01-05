import { SAVE, CLEAR, UPDATE, UPDATE_SINGLE } from './types';

export const updateMyTrackers = (trackers) => {
    return {
        type: UPDATE, trackers
    }
};

export const updateSingleTracker = (tracker) => {
    return {
        type: UPDATE_SINGLE, tracker
    }
}

export const saveMyTrackers = (trackers) => {
    return {
            type: SAVE, trackers
    };
};

export const clearMyTrackers = () => {
    return {
        type: CLEAR
    };
};

