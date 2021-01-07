import { SAVE, CLEAR, UPDATE, UPDATE_MY_SINGLE_TRACKER } from './types';

const INITIAL_STATE = {
    updatedAt: null,
    trackers: []
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SAVE:
          return {updatedAt: new Date(), trackers: action.trackers}
        
        case UPDATE: 
          return state.trackers.length !== 0 ? state : {updatedAt: new Date(), trackers: action.trackers};

        case UPDATE_MY_SINGLE_TRACKER: 
          return {
            ...state, 
            trackers: state.trackers.map(stateTracker => action.tracker.id === stateTracker.id ? action.tracker : stateTracker)
          };
        case CLEAR: return {};

        default: return state;
    }
};
export default reducer;