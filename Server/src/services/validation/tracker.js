import { FormValidator } from '../validation';

export const validateNewTracker = (tracker) => {
    const rFields = {
        from:       {type: 'string'},
        to:         {type: 'string'},
        startDates: {type: 'object', condition: (tr) => tr.type === 'N'},
        endDates:   {type: 'object', condition: (tr) => tr.type === 'N'},
        type:       {type: 'string'},
        pattern:    {type: 'object', condition: (tr) => tr.type === 'F'},
    };

    const vFields = {
        startDates: {min: new Date()},
        endDates:   {min: new Date()},
        type:       {possibleValues: ['N', 'F']},
    }

    let trackerValidator = new FormValidator(tracker, rFields, vFields, validateDates, endDatesAreAfterStartDates);
    let { valid, errors } = trackerValidator.execute();
    
    return { valid, errors};

    //Check if the dates are in the future, and end dates > start dates    


    //Tracker.findOne({iataCode: tracker.from})
    //Check if from and to (iataCodes) are valid
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