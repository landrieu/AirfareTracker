import { combineReducers } from 'redux';
import counterReducer from './Counter/reducer';
import setTrackerReducer from './SetTracker/reducer';
import homeInfoReducer from './HomeInfo/reducer';

const rootReducer = combineReducers({
    counter: counterReducer,
    setTracker: setTrackerReducer,
    homeInfo: homeInfoReducer
});
 
export default rootReducer;