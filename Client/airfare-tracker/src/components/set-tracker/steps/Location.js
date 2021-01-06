import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete } from '../../others/Autocomplete';
import { DataService } from '../../../services/dataService'
import './Location.scss';

import { saveForm, updateForm } from '../../../redux/SetTracker/actions';
import { useDispatch, useSelector} from 'react-redux';

export const Location = (props) => {
    const [fromError, setFromError] = useState('');
    const [toError, setToError] = useState('');

    const [airportSuggestions, setAirportSuggestions] = useState([]);

    const from = useSelector(state => state.setTracker.from);
    const to = useSelector(state => state.setTracker.to);
    const dispatch = useDispatch();

    function onSubmit(){
        let errors = validate();
        if(errors.length === 0) props.nextStep(1);
        else {
            errors.forEach(err => {
                err.trigger(err.message);
            })
        };
    }

    function validate(){
        let errors = [];

        if(typeof from !== "object") errors.push({trigger: setFromError, message: "Please select an airport"});
        if(typeof to !== "object") errors.push({trigger: setToError, message: "Please select an airport"});
        return errors;
    }

    function backStep(){
        if(!props.isActive){
            props.nextStep('Location');
        }
    }

    
    function setDefaultValue(type, index){
        if(type === 'from') setFrom(airportSuggestions[index]);
        if(type === 'to') setTo(airportSuggestions[index]);
    }

    function setFrom(value){
        dispatch(updateForm({from: value}));
    }

    function setTo(value){
        dispatch(updateForm({to: value}));
    }

    function fetchSuggestions(searchTerm){
        if(typeof searchTerm === 'object') return;
        if(searchTerm.length < 3) return setAirportSuggestions([]);

        DataService.airportsBySearchTerm(searchTerm).then(({airports, searchTermQuery}) => {
            if(searchTermQuery !== searchTerm) return;
            setAirportSuggestions(airports.map(airport => ({
                ...airport,
                text: airport.isSingleAirport ? 
                    `${airport.name} - ${airport.city} (${airport.iataCode})` :
                    `${airport.city}, ${airport.country} (${airport.iataCode}) - All airports`
            })));
        }).catch(err => {
            //Failed to fetch new suggestions
            console.log(err);
        });
    }

    const activeDisplay = (
        <div>
            <div className="inline-fields">
                <Autocomplete 
                    ID='from' 
                    placeholder='From' 
                    suggestions={airportSuggestions} 
                    userInput={from} 
                    errorMessage={fromError}
                    setUserInput={setFrom}
                    onChangeSearchTerm={fetchSuggestions}
                    setDefaultValue={setDefaultValue}
                />
                <Autocomplete 
                    ID='to' 
                    placeholder='To' 
                    suggestions={airportSuggestions}  
                    userInput={to} 
                    errorMessage={toError}
                    setUserInput={setTo}
                    onChangeSearchTerm={fetchSuggestions}
                />
            </div>
            <div id="location-button" className="button" onClick={onSubmit}>
                <button>{props.buttonLabel}</button>
            </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            <div>
                <span>From {from.text}</span>
            </div> 
            <div>
                <span>To {to.text}</span>
            </div>
        </div>
    )

    function selectDisplay(){
        return props.isActive ? activeDisplay : unactiveDisplay;
    }

    function setClassNames(){
        let classNames = "step";
        if(props.isActive) classNames += " active";
        if(props.isVisible) classNames += " visible";
        return classNames;
    }

    return (
        <div id="step-location" className={setClassNames()} style={props.stepStyle} onClick={backStep}>
            {selectDisplay()}
        </div>
    )
}