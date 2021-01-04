import { SAVE, CLEAR, UPDATE } from './types';

export const updateMyTrackers = (trackers) => {
    return {
        type: UPDATE, trackers
    }
};

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

