import { SAVE, CLEAR_MY_TRACKERS, UPDATE, UPDATE_MY_SINGLE_TRACKER } from './types';

export const updateMyTrackers = (trackers) => {
    return {
        type: UPDATE, trackers
    }
};

export const updateSingleTracker = (tracker) => {
    return {
        type: UPDATE_MY_SINGLE_TRACKER, tracker
    }
}

export const saveMyTrackers = (trackers) => {
    return {
            type: SAVE, trackers
    };
};

export const clearMyTrackers = () => {
    console.log('CLZPF')
    return {
        type: CLEAR_MY_TRACKERS
    };
};

