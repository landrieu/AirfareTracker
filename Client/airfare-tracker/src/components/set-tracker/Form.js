import React, { useEffect, useState } from 'react';

import './Form.scss';
import { authService } from '../../services/authService';

import { Email } from './steps/Email';
import { Location } from './steps/Location';
import { Dates } from './steps/Dates';
import { Alert } from './steps/Alert';
import { DataService } from '../../services/dataService';

import { saveForm } from '../../redux/SetTracker/actions';
import { useDispatch, useSelector} from 'react-redux';

export const Form = (props) => {
    const [canCreateTracker, setCanCreateTracker] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stepSequence, setStepSequence] = useState([]);
    const [activeStep, setActiveStep] = useState(-1);
    const [readOnlyForm, setReadOnlyForm] = useState(false);

    const authSequence = ['Location', 'Dates', 'Alert'];
    const unknSequence = ['Email', 'Location', 'Dates', 'Alert'];

    const [currentTrackerForm, setCurrentTrackerForm] = useState({});
    
    //Email 
    const [email, setEmail] = useState('lio23@hotmail.fr');
    const [departureDates, setDepartureDates] = useState('');

    const fromU = useSelector(state => state.setTracker.from);
    const dispatch = useDispatch();

    useEffect(() => {
        //Check if the user can create a new tracker
        //If registered up to 5
        //Else 2
        setTimeout(() => {
            checkTrackerCreation();
            setStepSequence(unknSequence);
            setLoading(false);
            setCanCreateTracker(true);
            setActiveStep(0);

            //dispatch(saveForm({email: 'LO', from: 'TLS'}));
        }, 500);

        return () => {
            console.log("ferf")
            //props.setTracker({email: 'lio'})
            
            //saveForm({email: email, from: 'TLS', to: 'PAR'});
        }
    }, []);

    function checkTrackerCreation(){
        if(authService.loggedIn()){
            DataService.canCreateNewTracker().then(res => {
                console.log(res);
            })
        }else{
            setStepSequence(unknSequence);
        }
        //Check if auth or not
            //Yes, nb trackers created < 5
                //Set auth Sequence
            //No, nb tracker < 2
                //Set unkw sequence
    }

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
        resetForm();
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

    function resetForm(){
        setEmail('');

        //setStepSequence(authSequence);
        setLoading(false);
        //setCanCreateTracker(true);
        setActiveStep(0);
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
                        buttonLabel={stepSequence.indexOf('Email') === (stepSequence.length - 1) ? 'Submit' : 'Next'}
                    />}
                    <Location 
                        isActive={isStepActive('Location')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Location')} 
                        isVisible={isVisible('Location')}
                        buttonLabel={stepSequence.indexOf('Location') === (stepSequence.length - 1) ? 'Submit' : 'Next'}
                    />
                    <Dates 
                        isActive={isStepActive('Dates')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Dates')} 
                        isVisible={isVisible('Dates')}
                        departureDates={departureDates}
                        setDepartureDates={setDepartureDates}
                        buttonLabel={stepSequence.indexOf('Dates') === (stepSequence.length - 1) ? 'Submit' : 'Next'}
                    />
                    <Alert 
                        isActive={isStepActive('Alert')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Alert')} 
                        isVisible={isVisible('Alert')}
                        buttonLabel={stepSequence.indexOf('Alert') === (stepSequence.length - 1) ? 'Submit' : 'Next'}

                    />
                </div>
            </div>)
    }

    return(
        <div id="form">
            {displayCanCreateTracker()}
        </div>
    )
}