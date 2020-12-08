import React, { useEffect, useState } from 'react';

import './SetTracker.scss'

export const SetTracker = (props) => {
    const [canCreateTracker, setCanCreateTracker] = useState(false);

    const [userInput, setUserInput] = useState('');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');
    const [fromFilteredSuggestions, setFromFilteredSuggestions] = useState([]);
    const [toFilteredSuggestions, setToFilteredSuggestions] = useState([]);

    const autocomplete = {
        'from': {value: fromValue, setValue: setFromValue, suggestions: fromSuggestions, setSuggestions: setFromSuggestions, filteredSuggestions: fromFilteredSuggestions, setFilteredSuggestions: setFromFilteredSuggestions},
        'to':   {value: toValue, setValue: setToValue, suggestions: toSuggestions, setSuggestions: setToSuggestions, filteredSuggestions: toFilteredSuggestions, setFilteredSuggestions: setToFilteredSuggestions}
    }

    useEffect(() => {
        //Check if the user can create a new tracker
        //If registered up to 5
        //Else 2
        setTimeout(() => {
            setCanCreateTracker(true);
        }, 5000);

        setTimeout(() => {
            setFromSuggestions([{city: 'Toulouse'}, {city: 'Paris'}, {city: 'Tours'}, {city: 'Toulon'}]);
            setToSuggestions([{city: 'Toulouse'}, {city: 'Paris'}, {city: 'Tours'}, {city: 'Toulon'}]);
        }, 1000)
        
    }, []);

    function onChangeAutoComplete(e, field){
        const auto = autocomplete[field];
        const userInput = e.currentTarget.value;

        const filteredSuggestions = auto.suggestions.filter(suggestion =>
            suggestion.city.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
        //console.log(userInput, filteredSuggestions);
        auto.setFilteredSuggestions(filteredSuggestions);
        auto.setValue(userInput);
    }

    function onKeyDownAutoComplete(e, field){
        //Enter
        if(e.keyCode === 13){

        //Up arrow
        }else if(e.keyCode === 38){
        
        //Down arrow
        }else if(e.keyCode === 40){

        }
    }

    return(
        <div id="set-tracker">
            <div id="set-tracker-form" className={canCreateTracker ? '' : 'disabled'}>
                <div id="set-tracker-title">Create a tracker</div>
                <div id="set-tracker-fields">
                    <div className="inline-fields">
                        <div id="set-tracker-from">
                            <input type="text" placeholder="from" onChange={(e) => onChangeAutoComplete(e, 'from')} onKeyDown={(e) => onKeyDownAutoComplete(e, 'from')}/>
                            <SuggestionList suggestions={fromFilteredSuggestions}/>
                        </div>
                        <div id="set-tracker-to">
                            <input type="text" placeholder="to" onChange={(e) => onChangeAutoComplete(e, 'to')} onKeyDown={(e) => onKeyDownAutoComplete(e, 'to')}/>
                            <SuggestionList suggestions={toFilteredSuggestions}/>
                        </div>
                    </div>
                    <div className="inline-fields">
                        <div>
                            <input type="text" id="departure-date-from" placeholder="Departure date from"/>
                        </div>
                        <div>
                            <input type="text" id="departure-date-to" placeholder="Departure date to"/>
                        </div>
                    </div>
                    <div id="email-price" className="inline-fields">
                        <div>
                            <input type="text" placeholder="Email"/>
                        </div>
                        <div>
                            <input type="number" placeholder="Price limit"/>
                        </div>
                    </div>
                </div>
                <div id="set-tracker-button">
                    <button><div>Submit</div></button>
                </div>
            </div>
        </div>
    )
}

export const SuggestionList = (props) => {
    function getSuggestionList(){
        return props.suggestions.map((suggestion, index) => {
            let className = props.activeSuggestion === index ? 'active' : '';
            return (<li className={className} key={suggestion.city}>{suggestion.city}</li>)
        });
    }
    const suggestionsList = props.suggestions && props.suggestions.length > 0 ? getSuggestionList() : '';

    return (
        <ul>
            {suggestionsList}
        </ul>
    )
}