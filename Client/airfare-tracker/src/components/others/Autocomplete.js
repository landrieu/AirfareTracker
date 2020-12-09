import React, { useEffect, useRef, useState } from 'react';
import './Autocomplete.scss';

import {useComponentVisible} from './UseComponentVisible';

export const Autocomplete = (props) => {
    const {ref} = useComponentVisible(false, handlerClickOutside);
    
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    function handlerClickOutside(){
        setShowSuggestions(false);
        console.log(filteredSuggestions, props);
        //setUserInput(filteredSuggestions.length > 0 ? filteredSuggestions[activeSuggestion].city : '');
    }

    function onChange(e){
        const userInput = e.currentTarget.value;

        const filteredSuggestions = props.suggestions.filter(suggestion =>
            suggestion.city.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        setFilteredSuggestions(filteredSuggestions);
        setActiveSuggestion(0);
        setShowSuggestions(true);
        setUserInput(userInput);
    }

    function onKeyDown(e){
        //Enter
        if(e.keyCode === 13){
            setActiveSuggestion(0);
            setShowSuggestions(false);
            setUserInput(filteredSuggestions[activeSuggestion].city);
        //Up arrow
        }else if(e.keyCode === 38){
            if(activeSuggestion === 0) return;
            setActiveSuggestion(activeSuggestion - 1);
        //Down arrow
        }else if(e.keyCode === 40){
            if(activeSuggestion === filteredSuggestions.length - 1) return;
            setActiveSuggestion(activeSuggestion + 1);
        }
    }

    function onClick(e){
        setActiveSuggestion(0);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setUserInput(e.currentTarget.innerText);
    }

    function getAutocompleteID(){
        return props.ID || Math.floor(Math.random() * 1000);
    }

    return(
        <div id={"autocomplete-" + getAutocompleteID()} className="autocomplete" ref={ref}>
            <input type="text" placeholder={props.placeholder} onChange={(e) => onChange(e)} onKeyDown={(e) => onKeyDown(e)} value={userInput}/>
            {showSuggestions && userInput && 
            <SuggestionList suggestions={filteredSuggestions} activeSuggestion={activeSuggestion} onClick={onClick}/>}
        </div>       
    )
}

export const SuggestionList = (props) => {
    function getSuggestionList(){
        return props.suggestions.map((suggestion, index) => {
            let className = props.activeSuggestion === index ? 'active' : '';
            return (
            <li 
                className={className} 
                key={suggestion.city}
                onClick={(e) => props.onClick(e)}
                >
                    {suggestion.city}
            </li>)
        });
    }
    const suggestionsList = props.suggestions && props.suggestions.length > 0 ? getSuggestionList() : '';

    return (
        <ul className="suggestions-list">
            {suggestionsList}
        </ul>
    )
}