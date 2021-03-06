//import { tracker } from '../../typeDefs/tracker';
import { Airport } from '../../database/models/Airport';

import { FormValidator } from '../../classes/FormValidator';
import { InputError } from '../../classes/RequestOperation';

const NTrackerValidators = () => {
    const requiredFields = {
        from:       {type: 'string'},
        to:         {type: 'string'},
        startDates: {type: 'object', condition: (tr) => tr.type === 'N'},
        endDates:   {type: 'object', condition: (tr) => tr.type === 'N'},
        type:       {type: 'string'},
    };

    const valueFields = {
        startDates: {min: new Date()},
        endDates:   {min: new Date()},
        type:       {possibleValues: ['N']},
    }

    const additionnalValidators = [validateDates, endDatesAreAfterStartDates, airportsExist];

    return [requiredFields, valueFields, additionnalValidators];
};

const FTrackerValidators = () => {
    const requiredFields = {
        from:         {type: 'string'},
        to:           {type: 'string'},
        type:         {type: 'string'},
        occurrences:  {type: 'object', condition: (tr) => tr.type === 'F'},
    };

    const valueFields = {
        startDates: {min: new Date()},
        endDates:   {min: new Date()},
        type:       {possibleValues: ['F']},
    }

    const additionnalValidators = [airportsExist];

    return [requiredFields, valueFields, additionnalValidators];
};

export const validateNewTracker = async (tracker) => {
    let requiredFields, valueFields, additionnalValidators;

    if(tracker.type === 'N'){
        [requiredFields, valueFields, additionnalValidators] = NTrackerValidators();
    }else if (tracker.type ==="F"){
        [requiredFields, valueFields, additionnalValidators] = FTrackerValidators();
    }else{
        return {valid: false, errors: [new InputError(null, "Tracker type unknow")]};
    }
    
    let trackerValidator = new FormValidator(tracker, {requiredFields, valueFields}, ...additionnalValidators);
    let { valid, errors } = await trackerValidator.execute();

    return { valid, errors};

    //Check if the dates are in the future, and end dates > start dates    


    //Tracker.findOne({iataCode: tracker.from})
    //Check if from and to (iataCodes) are valid
};

const airportsExist = async (tracker, errors) => {
    let fromAirport = await Airport.findOne({iataCode: tracker.from});
    if(!fromAirport) errors.push(new InputError(null, `The airport: ${tracker.from} does not exist.`));

    let toAirport = await Airport.findOne({iataCode: tracker.to});
    if(!toAirport) errors.push(new InputError(null, `The airport: ${tracker.to} does not exist.`));
};

const validateDates = (tracker, errors) => {
    const checkDatesAreInFuture = (dates) => {
        for(let date of dates){
            if(new Date(date) < new Date()){
                errors.push(new InputError(null, `Dates must be in the future`));
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
                errors.push(new InputError(null, `The return dates must be prior to the departure dates`));
                return;
            }
        }
    }
}