import { UPDATE_AIRPORT, UPDATE_TRACKERS } from './types';
import { TRACKER_STATUS } from '../../services/appConstant';

const INITIAL_STATE = {
    nearestAirport: null,
    nearestTrackers: (new Array(6)).fill({status: TRACKER_STATUS.INACTIVE})
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_AIRPORT:
            return {
                ...state, nearestAirport: action.nearestAirport,
            };

        case UPDATE_TRACKERS:
            let nearestTrackers = updateTrackersReducer(state.nearestTrackers, action.command);
            
            return {
                ...state, nearestTrackers
            };

        default: return state;
    }
};

const updateTrackersReducer = (trackers, {updateType, trackerId, data}) => {
    switch (updateType) {
        case TRACKER_STATUS.INIT:
            return data.map(el => ({...el,status: TRACKER_STATUS.INIT}));

        case 'status':
            if(trackerId) return trackers.map(el => (el.id === trackerId ? {...el, ...data} : el));
            else return trackers.map(el => ({...el, ...data}));

        case TRACKER_STATUS.COMPLETE:
            return trackers.map(el => {
                if(el.id === trackerId) return {...el, airfares: data, status: TRACKER_STATUS.COMPLETE};
                else return {...el, status: TRACKER_STATUS.COMPLETE}
            });      

        default: console.log(`Update type not recognized: ${updateType}`);
            break;
    }
}

export default reducer;