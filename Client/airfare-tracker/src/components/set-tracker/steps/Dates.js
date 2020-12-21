import React, { useEffect, useState } from 'react';
//import 'react-dates/initialize';
//import 'react-dates/lib/css/_datepicker.css';
//import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
//import moment from 'moment';
import moment from 'moment';

import { DateRangePicker } from '../../misc/DateRangePicker';
import './Dates.scss';

export const Dates = (props) => {

    const [startDateDeparture, setStartDateDeparture] = useState();
    const [endDateDeparture, setEndDateDeparture] = useState();

    const [startDateReturn, setStartDateReturn] = useState();
    const [endDateReturn, setEndDateReturn] = useState();

    function onSubmit() {
        props.nextStep(1);
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
                        startDate={startDateDeparture}
                        endDate={endDateDeparture}
                        setStartDate={setStartDateDeparture}
                        setEndDate={setEndDateDeparture}
                        startDateId='start_date_01'
                        endDateId='end_date_01'
                        maxDate={startDateReturn ? moment(startDateReturn).add(-1, 'd') : null}
                    />
                </div>
                <div>
                <DateRangePicker
                        startDate={startDateReturn}
                        endDate={endDateReturn}
                        setStartDate={setStartDateReturn}
                        setEndDate={setEndDateReturn}
                        startDateId='start_date_02'
                        endDateId='end_date_02'
                        minDate={endDateDeparture ? moment(endDateDeparture).add(1, 'd') : null}
                    />
                </div>
            </div>
            <div id="location-button" className="button" onClick={onSubmit}>
                    <button>{props.buttonLabel}</button>
                </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            <div>Departure dates: {startDateDeparture && startDateDeparture.format()} - {endDateDeparture && endDateDeparture.format()}</div>
            <div>Return dates: {startDateReturn && startDateReturn.format()} - {endDateReturn && endDateReturn.format()}</div>
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
