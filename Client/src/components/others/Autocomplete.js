import React, { useState } from 'react';
import './Autocomplete.scss';

import {useComponentVisible} from './UseComponentVisible';

export const Autocomplete = (props) => {
    const {ref} = useComponentVisible(false, handlerClickOutside);
    
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);

    function handlerClickOutside(){
        setShowSuggestions(false);
    }

    function onChange(e){
        const userInput = e.currentTarget.value;

        setActiveSuggestion(0);
        setShowSuggestions(true);
        props.setUserInput(userInput);
    }
    

    function onKeyUp(){
        console.log('KEY UP')
        props.onChangeSearchTerm(props.userInput);
    }

    function onKeyDown(e){
        //Enter
        if(e.keyCode === 13){
            setActiveSuggestion(0);
            setShowSuggestions(false);
            props.setUserInput(props.suggestions[activeSuggestion]);
        //Up arrow
        }else if(e.keyCode === 38){
            if(activeSuggestion === 0) return;
            setActiveSuggestion(activeSuggestion - 1);
        //Down arrow
        }else if(e.keyCode === 40){
            if(activeSuggestion === props.suggestions.length - 1) return;
            setActiveSuggestion(activeSuggestion + 1);
        }
    }

    function onClick(e, value){
        setActiveSuggestion(0);
        setShowSuggestions(false);
        props.setUserInput(value);
    }

    function getAutocompleteID(){
        return props.ID || Math.floor(Math.random() * 1000);
    }

    return(
        <div id={"autocomplete-" + getAutocompleteID()} className="autocomplete" ref={ref}>
            <input 
                type="text" 
                placeholder={props.placeholder} 
                onChange={(e) => onChange(e)} 
                onKeyDown={(e) => onKeyDown(e)} 
                onKeyUp={(e) => onKeyUp(e)}
                value={typeof props.userInput === 'string' ? props.userInput : props.userInput.text}
            />
            {props.errorMessage && <div>{props.errorMessage}</div>}
            {showSuggestions && props.userInput && 
            <SuggestionList 
                suggestions={props.suggestions} 
                activeSuggestion={activeSuggestion} 
                onClick={onClick}
            />}
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
                key={suggestion.id}
                onClick={(e) => props.onClick(e, suggestion)}
            >
                    {/*suggestion.text*/}
                    
                    <div className="suggestion-left">
                        <div className="suggestion-name">
                            {suggestion.isSingleAirport ? suggestion.name : `${suggestion.city} - All airports`}
                        </div>
                        <div className="suggestion-city" style={{display: suggestion.isSingleAirport ? 'block' : 'none'}}>
                            {suggestion.city}
                        </div>
                    </div>
                    <div className="suggestion-right"><span>{suggestion.iataCode}</span></div>
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