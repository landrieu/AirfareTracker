import React, { useEffect, useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker as DatePicker} from 'react-dates';
import moment from 'moment';

import './DateRangePicker.scss'

export const DateRangePicker = (props) => {
    const [focusField, setFocusField] = useState(null);

    function setNewDates(startDate, endDate) {
        props.setStartDate(startDate);
        props.setEndDate(endDate);
    }

    function onFocusChange(input) {
        setFocusField(input);
    }

    function isOutsideRange(day) {
        return (
        (props.minDate && day.isBefore(props.minDate)) || 
        (props.maxDate && day.isAfter(props.maxDate)) || 
        (day.isBefore(moment().add(1, 'd'))) ||
        (focusField === 'endDate' && 
        day.isAfter(moment(props.startDate).add(3, 'd')) || day.isBefore(props.startDate)));
    }

    useEffect(() => {

    }, []);


    return (
        <DatePicker
            showDefaultInputIcon={true}
            displayFormat="DD-MM-YYYY"
            numberOfMonths={1}
            noBorder={true}
            hideKeyboardShortcutsPanel={true}
            startDate={props.startDate} // momentPropTypes.momentObj or null,
            startDateId={props.startDateId} // PropTypes.string.isRequired,
            endDate={props.endDate} // momentPropTypes.momentObj or null,
            endDateId={props.endDateId} // PropTypes.string.isRequired,
            onDatesChange={({ startDate, endDate }) => {
                setNewDates(startDate, endDate)
            }}
            isOutsideRange={day => isOutsideRange(day)}
            minDate={moment()}
            maxDate={moment().add(1, 'y')}
            focusedInput={focusField}
            onFocusChange={focusedInput => onFocusChange(focusedInput)}
        />
    )
}
