import { combineReducers } from 'redux';
import counterReducer from './Counter/reducer';
import setTrackerReducer from './SetTracker/reducer';

const rootReducer = combineReducers({
    counter: counterReducer,
    setTracker: setTrackerReducer
});
 
export default rootReducer;