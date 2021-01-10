import React, { useState } from 'react';
import moment from 'moment';
import { updateForm } from '../../../redux/SetTracker/actions';

import { useDispatch, useSelector } from 'react-redux';

import { DateRangePicker } from '../../misc/DateRangePicker';
import './Dates.scss';

export const Dates = (props) => {
    const [startDateDeparture, endDateDeparture] = useSelector(state => state.setTracker.departureDates);
    const [startDateReturn, endDateReturn] = useSelector(state => state.setTracker.returnDates);
    const dispatch = useDispatch();

    const [departureDatesError, setDepartureDatesError] = useState('');
    const [returnDatesError, setReturnDatesError] = useState('');
    const [formError, setFormError] = useState('');

    function setDepartureDates(startDate, endDate) {
        setDepartureDatesError('');
        dispatch(updateForm({ departureDates: [startDate, endDate] }));
    }

    function setReturnDates(startDate, endDate) {
        setReturnDatesError('');
        dispatch(updateForm({ returnDates: [startDate, endDate] }));
    }

    function onSubmit() {
        let { valid, errors } = validate();
        if (valid) return props.nextStep(1);

        errors.forEach(err => setError(err));
    }

    function setError({target, message = ''} = {}){
        switch (target) {
            case 'departureDates':
                setDepartureDatesError(message);
                break;
            
            case 'returnDates':
                setReturnDatesError(message);
                break;
        
            default: 
                setFormError(message);
                break;
        }
    }

    function validate() {
        let errors = [];

        if(!(startDateDeparture && startDateDeparture.isValid() && endDateDeparture && endDateDeparture.isValid())){
            errors.push({target: 'departureDates', message: 'Dates not defined'});
        }

        if (!(startDateReturn && startDateReturn.isValid() && endDateReturn && endDateReturn.isValid())) {
            errors.push({target: 'returnDates', message: 'Dates not defined'});
        }

        if (errors.length === 0 && !(endDateReturn.isSameOrAfter(startDateReturn)
            && startDateReturn.isSameOrAfter(endDateDeparture)
            && endDateDeparture.isSameOrAfter(startDateDeparture))) {
            errors.push({message: 'Chronology error'});
        }

        return { valid: errors.length === 0, errors };
    }

    function backStep() {
        if (!props.isActive) {
            props.nextStep('Dates');
        }
    }

    const activeDisplay = (
        <div>
            <div className="tip">
                You can select a range for your departure and return dates.
            </div>
            <div className="inline-fields">
                <div>
                    <DateRangePicker
                        placeHolderStart="Departure"
                        startDate={startDateDeparture}
                        endDate={endDateDeparture}
                        setDates={setDepartureDates}
                        startDateId='start_date_01'
                        endDateId='end_date_01'
                        maxDate={startDateReturn ? moment(startDateReturn).add(-1, 'd') : null}
                    />
                    <div id="dates-error" className="error-message">
                        {departureDatesError}
                    </div>
                </div>
                <div>
                    <DateRangePicker
                        placeHolderStart="Return"
                        startDate={startDateReturn}
                        endDate={endDateReturn}
                        setDates={setReturnDates}
                        startDateId='start_date_02'
                        endDateId='end_date_02'
                        minDate={endDateDeparture ? moment(endDateDeparture).add(1, 'd') : null}
                    />
                    <div id="dates-error" className="error-message">
                        {returnDatesError}
                    </div>
                </div>
            </div>
            <div className="form-error">
                {formError}
            </div>

            <div id="location-button" className="button" onClick={onSubmit}>
                <button className={`${props.isLoading ? 'loading' : ''}`}>
                    {props.buttonLabel}
                </button>
            </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            {/*'DD/MM/YYYY'*/}
            <div>
                <span className="set-tracker-label">Departure dates range: </span>
                {startDateDeparture && startDateDeparture.format('dddd DD MMMM YYYY')} - {endDateDeparture && endDateDeparture.format('dddd DD MMMM YYYY')}
            </div>
            <div>
                <span className="set-tracker-label">Return dates range: </span> 
                {startDateReturn && startDateReturn.format('dddd DD MMMM YYYY')} - {endDateReturn && endDateReturn.format('dddd DD MMMM YYYY')}
            </div>
        </div>
    )

    function selectDisplay() {
        return props.isActive ? activeDisplay : unactiveDisplay;
    }

    function setClassNames() {
        let classNames = "step";
        if (props.isActive) classNames += " active";
        if (props.isVisible) classNames += " visible";
        return classNames;
    }

    return (
        <div id="step-dates" className={setClassNames()} style={props.stepStyle} onClick={backStep}>
            {selectDisplay()}
        </div>
    )
}
