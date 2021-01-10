import { combineReducers } from 'redux';
import setTrackerReducer from './SetTracker/reducer';
import homeInfoReducer from './HomeInfo/reducer';
import myTrackersReducer from './MyTrackers/reducer';

const rootReducer = combineReducers({
    setTracker: setTrackerReducer,
    homeInfo: homeInfoReducer,
    myTrackers: myTrackersReducer
});
 
export default rootReducer;