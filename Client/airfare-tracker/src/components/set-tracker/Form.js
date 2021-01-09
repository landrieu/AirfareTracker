import React, { useEffect, useState } from 'react';

import './Form.scss';
import { authService } from '../../services/authService';

import { Email } from './steps/Email';
import { Location } from './steps/Location';
import { Dates } from './steps/Dates';
import { Alert } from './steps/Alert';
import { DataService } from '../../services/dataService';

import { useDispatch, useSelector} from 'react-redux';

export const Form = () => {
    const [canCreateTracker, setCanCreateTracker] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    //const [trackerCreated, setTrackerCreated] = useState(false);
    const [stepSequence, setStepSequence] = useState([]);
    const [activeStep, setActiveStep] = useState(-1);

    const authSequence = ['Location', 'Dates', 'Alert'];
    const unknSequence = ['Email', 'Location', 'Dates', 'Alert'];

    const form = useSelector(state => state.setTracker)
    
    //const dispatch = useDispatch();

    useEffect(async() => {
        //Check if the user can create a new tracker
  
        let [canCreate, sequence] = await checkTrackerCreation();
        setCanCreateTracker(canCreate);
        setInitializing(false);

        if(canCreate){
            setStepSequence(sequence);
            setActiveStep(0);
        }


        return () => {

        }
    }, []);

    /**
     * Check if auth or not
            //Yes, nb trackers created < 5
                //Set auth Sequence
            //No, nb tracker < 2
                //Set unkw sequence
     */
    function checkTrackerCreation(){
        //
        return new Promise(resolve => {
            if(authService.loggedIn()){
                DataService.canCreateNewTracker().then(res => {
                    resolve([res.canCreateNewTracker, authSequence]);
                }).catch((e) => {
                    resolve([false]);
                })
            }else{
                resolve([true, unknSequence]);
            }
        });
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
        if(loading) return;

        setLoading(true);
        setTimeout(() => setLoading(false), 5000);

        DataService.createTracker(form)
        .then(res => {
            setLoading(false);
            console.log(res);
            //Add new tracker to redux 'myTrackers
        }).catch((e) => {
            setLoading(false);
        });
        //resetForm();
    }

    function nextStep(step){
        if(loading) return;

        let backStep = typeof step === "string";
        step = typeof step === "string" ? stepSequence.indexOf(step) : step;
        if(step < 0) return;

        if(backStep) return setActiveStep(step);
        if((activeStep + step) > stepSequence.length - 1) submitForm();
        else setActiveStep(activeStep + step);
    }

    function displayCanCreateTracker(){
        if(initializing){
            return (<div>Loading...</div>)
        }else if(canCreateTracker){
            return (formSteps())
        }else{
            return (<div>Can't create a tracker, the limit has been reached</div>)
        }
    }

    function progressionBarStyle(){
        let style = {};
        if(stepSequence.length > 0) style.width = `${(activeStep / (stepSequence.length - 1)) * 100}%`;
        else style.width = '0px';
        return style;
    }

    function resetForm(){
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
                        isLoading={loading}
                        buttonLabel={stepSequence.indexOf('Email') === (stepSequence.length - 1) ? 'Submit' : 'Next'}
                    />}
                    <Location 
                        isActive={isStepActive('Location')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Location')} 
                        isVisible={isVisible('Location')}
                        isLoading={loading}
                        buttonLabel={stepSequence.indexOf('Location') === (stepSequence.length - 1) ? 'Submit' : 'Next'}
                    />
                    <Dates 
                        isActive={isStepActive('Dates')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Dates')} 
                        isVisible={isVisible('Dates')}
                        isLoading={loading}
                        buttonLabel={stepSequence.indexOf('Dates') === (stepSequence.length - 1) ? 'Submit' : 'Next'}
                    />
                    <Alert 
                        isActive={isStepActive('Alert')} 
                        nextStep={nextStep} 
                        stepStyle={stepStyle('Alert')} 
                        isVisible={isVisible('Alert')}
                        isLoading={loading}
                        buttonLabel={stepSequence.indexOf('Alert') === (stepSequence.length - 1) ? 'Submit' : 'Next'}

                    />
                </div>
            </div>)
    }

    return(
        <div id="form" className={`${loading ? 'loading' : ''}`}>
            {displayCanCreateTracker()}
        </div>
    )
}