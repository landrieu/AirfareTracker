import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { saveForm, updateForm } from '../../../redux/SetTracker/actions';

import { useDispatch, useSelector} from 'react-redux';

import { DateRangePicker } from '../../misc/DateRangePicker';
import './Dates.scss';

export const Dates = (props) => {

    //const [startDateDeparture, setStartDateDeparture] = useState();
    //const [endDateDeparture, setEndDateDeparture] = useState();

    const [startDateDeparture, endDateDeparture] = useSelector(state => state.setTracker.departureDates);
    const [startDateReturn, endDateReturn] = useSelector(state => state.setTracker.returnDates);
    const dispatch = useDispatch();

    const [datesError, setDatesError] = useState('');

    function setDepartureDates(startDate, endDate){
        dispatch(updateForm({departureDates: [startDate, endDate]}));
    }

    function setReturnDates(startDate, endDate){
        dispatch(updateForm({returnDates: [startDate, endDate]}));
    }

    function onSubmit() {
        let {valid, error} = validate();
        if(valid) props.nextStep(1);
        else setDatesError(error);
    }

    function validate(){
        let errors = [];

        if(!(startDateDeparture && startDateDeparture.isValid() && endDateDeparture
         && endDateDeparture.isValid() && startDateReturn && startDateReturn.isValid() 
         && endDateReturn && endDateReturn.isValid())){
            return { valid: false, error: 'Date not defined'};
        }

        if(!(endDateReturn.isSameOrAfter(startDateReturn) 
        && startDateReturn.isSameOrAfter(endDateDeparture)
        && endDateDeparture.isSameOrAfter(startDateDeparture))){
            return { valid: false, error: 'Chronology error'};
        }

        return { valid: true}
    }

    function backStep() {
        if (!props.isActive) {
            props.nextStep('Dates');
        }
    }

    useEffect(() => {

    }, []);

    const activeDisplay = (
        <div>
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
                </div>
            </div>
            <div id="dates-error">
                {datesError}
            </div>
            <div id="location-button" className="button" onClick={onSubmit}>
                    <button>{props.buttonLabel}</button>
                </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            <div>Departure dates range: {startDateDeparture && startDateDeparture.format('DD/MM/YYYY')} - {endDateDeparture && endDateDeparture.format('DD/MM/YYYY')}</div>
            <div>Return dates range: {startDateReturn && startDateReturn.format('dddd DD MMMM YYYY')} - {endDateReturn && endDateReturn.format('DD/MM/YYYY')}</div>
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
