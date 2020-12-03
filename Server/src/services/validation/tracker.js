//import { tracker } from '../../typeDefs/tracker';
import { Airport } from '../../database/models/Airport';

import { FormValidator } from '../validation';

const NTrackerValidators = () => {
    const rFields = {
        from:       {type: 'string'},
        to:         {type: 'string'},
        startDates: {type: 'object', condition: (tr) => tr.type === 'N'},
        endDates:   {type: 'object', condition: (tr) => tr.type === 'N'},
        type:       {type: 'string'},
    };

    const vFields = {
        startDates: {min: new Date()},
        endDates:   {min: new Date()},
        type:       {possibleValues: ['N']},
    }

    const additionnalValidators = [validateDates, endDatesAreAfterStartDates, airportsExist];

    return [rFields, vFields, additionnalValidators];
};

const FTrackerValidators = () => {
    const rFields = {
        from:         {type: 'string'},
        to:           {type: 'string'},
        type:         {type: 'string'},
        occurrences:  {type: 'object', condition: (tr) => tr.type === 'F'},
    };

    const vFields = {
        startDates: {min: new Date()},
        endDates:   {min: new Date()},
        type:       {possibleValues: ['F']},
    }

    const additionnalValidators = [airportsExist];

    return [rFields, vFields, additionnalValidators];
};

export const validateNewTracker = async (tracker) => {
    let rFields, vFields, additionnalValidators;

    if(tracker.type === 'N'){
        [rFields, vFields, additionnalValidators] = NTrackerValidators();
    }else if (tracker.type ==="F"){
        [rFields, vFields, additionnalValidators] = FTrackerValidators();
    }else{
        return {valid: false, errors: ["Tracker type unknow"]};
    }
    
    let trackerValidator = new FormValidator(tracker, rFields, vFields, ...additionnalValidators);
    let { valid, errors } = await trackerValidator.execute();

    return { valid, errors};

    //Check if the dates are in the future, and end dates > start dates    


    //Tracker.findOne({iataCode: tracker.from})
    //Check if from and to (iataCodes) are valid
};

const airportsExist = async (tracker, errors) => {
    let fromAirport = await Airport.findOne({iataCode: tracker.from});
    if(!fromAirport) errors.push(`The airport: ${tracker.from} does not exist.`);

    let toAirport = await Airport.findOne({iataCode: tracker.to});
    if(!toAirport) errors.push(`The airport: ${tracker.to} does not exist.`);
};

const validateDates = (tracker, errors) => {
    const checkDatesAreInFuture = (dates) => {
        for(let date of dates){
            if(new Date(date) < new Date()){
                errors.push(`Dates must be in the future`);
                break;
            }
        }
    }

    if(tracker.type === 'N'){
        checkDatesAreInFuture(tracker.startDates);
        checkDatesAreInFuture(tracker.endDates);
    }
};

const endDatesAreAfterStartDates = (tracker, errors) => {
    for(let i = 0; i < tracker.startDates.length; i++){
        for(let j = 0; j < tracker.endDates.length; j++){
            if(tracker.startDates[i] > tracker.endDates[j]){
                errors.push(`The return dates must be prior to the departure dates`);
                return;
            }
        }
    }
}