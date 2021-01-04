import { SAVE, CLEAR, UPDATE } from './types';

const INITIAL_STATE = {
    updatedAt: null,
    trackers: []
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SAVE:
          return {updatedAt: new Date(), trackers: action.trackers}
        
        case UPDATE: 
        console.log('FZFZ', action);
          return {updatedAt: new Date(), trackers: action.trackers}

        case CLEAR: return {};

        default: return state;
    }
};
export default reducer;