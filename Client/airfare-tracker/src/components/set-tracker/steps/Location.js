import { useState } from 'react';
import { Autocomplete } from '../../others/Autocomplete';
import './Location.scss'

export const Location = (props) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    function onSubmit(){
        let {valid, errors} = validate();
        if(valid) props.nextStep(1);
        else {

        };
    }

    function validate(){
        return {valid: true}
    }

    function backStep(){
        if(!props.isActive){
            props.nextStep('Location');
        }
    }

    const activeDisplay = (
        <div>
            <div className="inline-fields">
                <Autocomplete ID='from' placeholder='From' suggestions={props.airports} userInput={from} setUserInput={setFrom}/>
                <Autocomplete ID='to' placeholder='To' suggestions={props.airports}  userInput={to} setUserInput={setTo}/>
            </div>
            <div id="location-button" className="button" onClick={onSubmit}>
                <button>Submit</button>
            </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            <span>Departure: {from} Destination: {to}</span>
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