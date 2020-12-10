import React, { useEffect, useState } from 'react';

import './Form.scss';

import { Email } from './steps/Email';
import { Location } from './steps/Location';
import { Dates } from './steps/Dates';
import { Alert } from './steps/Alert';
import { Autocomplete } from '../others/Autocomplete';

export const Form = (props) => {
    const [canCreateTracker, setCanCreateTracker] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stepSequence, setStepSequence] = useState([]);
    const [activeStep, setActiveStep] = useState(-1);

    const airports = [{city: 'Toulouse'}, {city: 'Paris'}, {city: 'Tours'}, {city: 'Toulon'}];

    const authSequence = ['Location', 'Dates', 'Alert'];
    const unknSequence = ['Email', 'Location', 'Dates', 'Alert'];
    
    //Email 
    const [email, setEmail] = useState('lio23@hotmail.fr');
    const [departureDates, setDepartureDates] = useState('');

    useEffect(() => {
        //Check if the user can create a new tracker
        //If registered up to 5
        //Else 2
        setTimeout(() => {
            setStepSequence(authSequence);
            setLoading(false);
            setCanCreateTracker(true);
            setActiveStep(0);
        }, 500);

        //setTimeout(() => {
        //let airports = 
            //}, 1000)
        
    }, []);

    function isStepActive(stepName){
        return stepName === stepSequence[activeStep];
    }

    function isVisible(stepName){
        if(stepName === 'Email'){
            console.log(stepSequence.indexOf(stepName) <= activeStep, stepSequence.indexOf(stepName), activeStep)
        }
        return (stepSequence.length > 0) 
        && stepSequence.indexOf(stepName) !== -1 
        && stepSequence.indexOf(stepName) <= activeStep;
    }

    function stepStyle(stepName){
        let style = {}
        style.transform = isVisible(stepName) ? "translateY(0)" : "translateY(800px)";
        return style;
    }

    function submitForm(){
        console.log("DDA");
    }

    function nextStep(step){
        if(typeof step === "number"){
            setActiveStep(activeStep + step);
            if((activeStep + step) > stepSequence.length - 1) submitForm();
        }
        if(typeof step === "string"){
            let stepIndex = stepSequence.indexOf(step);
            if(stepIndex !== -1){
                setActiveStep(stepIndex);
                if(stepIndex > stepSequence.length - 1) submitForm();
            }
        }
    }

    function displayCanCreateTracker(){
        if(loading){
            return (<div>Loading...</div>)
        }else if(canCreateTracker){
            return (formSteps())
        }else{
            return (<div>Can't create a tracker limit has been reached</div>)
        }
    }

    function progressionBarStyle(){
        let style = {};
        if(stepSequence.length > 0) style.width = `${(activeStep / (stepSequence.length - 1)) * 100}%`;
        else style.width = '0px';
        return style;
    }

    function formSteps(){
        return (
            
            <div id="form-steps">
                <div id="form-progression">
                    <div id="form-progression-bar" style={progressionBarStyle()}></div>
                </div>
                <div id="form-steps-container">
                    {(stepSequence.indexOf('Email') !== -1) && 
                    <Email 
                        isActive={isStepActive('Email')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Email')} 
                        isVisible={isVisible('Email')}
                        email={email}
                        setEmail={setEmail}
                    />}
                    <Location 
                        airports={airports} 
                        isActive={isStepActive('Location')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Location')} 
                        isVisible={isVisible('Location')}
                    />
                    <Dates 
                        isActive={isStepActive('Dates')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Dates')} 
                        isVisible={isVisible('Dates')}
                        departureDates={departureDates}
                        setDepartureDates={setDepartureDates}
                    />
                    <Alert isActive={isStepActive('Alert')} nextStep={nextStep} stepStyle={stepStyle('Alert')} isVisible={isVisible('Alert')}/>
                </div>
            </div>)
    }

    return(
        <div id="form">
            {displayCanCreateTracker()}
        </div>
    )
}
