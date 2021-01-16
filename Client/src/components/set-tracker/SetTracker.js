import React, { useEffect, useState } from 'react';

import './SetTracker.scss';
import { authService } from '../../services/authService';

import { Email } from './steps/Email';
import { Location } from './steps/Location';
import { Dates } from './steps/Dates';
import { Alert } from './steps/Alert';
import { DataService } from '../../services/dataService/';

import { LDSRing } from '../misc/Loaders';

import { useDispatch, useSelector } from 'react-redux';
import { clearForm, updateForm } from '../../redux/SetTracker/actions';


export const SetTracker = () => {
    const dispatch = useDispatch();

    const [canCreateTracker, setCanCreateTracker] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [trackerCreated, setTrackerCreated] = useState(null);
    const [stepSequence, setStepSequence] = useState([]);
    const [activeStep, setActiveStep] = useState(-1);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState([]);

    const form = useSelector(state => state.setTracker);

    const authSequence = ['Location', 'Dates', 'Alert'];
    const unknSequence = ['Email', 'Location', 'Dates', 'Alert'];

    async function initializeForm() {
        let [canCreate, sequence, error] = await checkTrackerCreation();
        setCanCreateTracker(canCreate);
        setError('');
        setInitializing(false);

        if (canCreate) {
            setStepSequence(sequence);
            setActiveStep(0);
        } else {
            //"Can't create a tracker, the limit has been reached"
            setError(error);
        }
    }

    useEffect(() => {
        //Check if the user can create a new tracker
        initializeForm();

        return () => {

        }
    }, []);

    /**
     * Check if auth or not
     * Yes, nb trackers created < 5 => Set auth Sequence
     * No, nb tracker < 2 => Set unkw sequence
     */
    function checkTrackerCreation() {
        //
        return new Promise(resolve => {
            if (authService.loggedIn()) {
                DataService.canCreateNewTracker().then(res => {
                    let user = authService.loadUser();
                    dispatch(updateForm({ email: user.email }));
                    resolve([res.canCreateNewTracker, authSequence, res.canCreateNewTracker ? '' : "You can't create a tracker, the limit has been reached"]);
                }).catch((e) => {
                    resolve([false, null, "Network issue, check your connection"]);
                })
            } else {
                resolve([true, unknSequence]);
            }
        });
    }

    function isStepActive(stepName) {
        return stepName === stepSequence[activeStep];
    }

    function isVisible(stepName) {
        return (stepSequence.length > 0)
            && stepSequence.indexOf(stepName) !== -1
            && stepSequence.indexOf(stepName) <= activeStep;
    }

    function stepStyle(stepName) {
        let style = {}
        style.transform = isVisible(stepName) ? "translateY(0)" : "translateY(800px)";
        return style;
    }

    function submitForm() {
        if (loading) return;

        setLoading(true);
        /*setTimeout(() => {
            setLoading(false);
            setTrackerCreated(true);
        }, 5000);*/

        DataService.createTracker(form).then(res => {
            if (res.success) return setTrackerCreated(res.tracker);
            else setFormError(res.errors);
            //Add new tracker to redux 'myTrackers
        }).catch((e) => {
            //Set the errors
            console.log(e.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    function nextStep(step) {
        if (loading) return;

        //Clear form errors
        setFormError([]);

        let backStep = typeof step === "string";
        step = typeof step === "string" ? stepSequence.indexOf(step) : step;
        if (step < 0) return;

        if (backStep) return setActiveStep(step);
        if ((activeStep + step) > stepSequence.length - 1) submitForm();
        else setActiveStep(activeStep + step);
    }

    function isLastStep() { return (activeStep === stepSequence.length - 1) }

    function renderSubmitButton() {
        return (
            <div>
                <div id="form-button" className={`button ${isLastStep() ? 'visible' : ''}`} onClick={() => nextStep(1)}>
                    <button className={`${loading ? 'loading' : ''}`}>Submit</button>
                </div>
                {isLastStep() && formError.map(({ _, message }, key) => {
                    return (
                        <div className="form-error-message error-message" key={key}>{message}</div>
                    )
                })}
            </div>
        );
    }

    function displayCanCreateTracker() {
        if (initializing) {
            return (
                <div id="set-tracker-loader">
                    <LDSRing />
                </div>
            );
        } else if (trackerCreated) {
            return (displayEndForm());
        } else if (canCreateTracker) {
            return (formSteps())
        } else if (error) {
            return (<div id='set-tracker-error'>{error}</div>);
        } else {
            return (<div id='set-tracker-unexpected-error'>Unexpected error</div>)
        }
    }

    function progressionBarStyle() {
        let style = {};
        if (stepSequence.length > 0) style.width = `${(activeStep / (stepSequence.length - 1)) * 100}%`;
        else style.width = '0px';
        return style;
    }

    function resetForm() {
        //Clear redux form
        dispatch(clearForm());

        //Set hooks to their initial states
        setCanCreateTracker(false);
        setInitializing(true);
        setActiveStep(-1);
        setError('');
        setTrackerCreated(null);

        //Re-initialize the form
        initializeForm();
    }

    function displayEndForm() {
        return (
            <div id="tracker-created">
                <div id="tracker-created-details">
                    <div><span>Your tracker has been successfully created.</span></div>
                    <div><span>Here is the id: {trackerCreated.id}</span></div>
                    <div><span>You will receive an email containing all the details!</span></div>
                </div>
                <div id="tracker-created-button">
                    <button onClick={resetForm}>Create a new tracker</button>
                </div>
            </div>);
    }

    function stepProps(stepName) {
        return {
            isActive: isStepActive(stepName),
            nextStep: nextStep,
            stepStyle: stepStyle(stepName),
            isVisible: isVisible(stepName),
            isLoading: loading,
            buttonLabel: stepSequence.indexOf(stepName) === (stepSequence.length - 1) ? 'Submit' : 'Next',
            lastStep: stepSequence.indexOf(stepName) === (stepSequence.length - 1)
        }
    }

    function formSteps() {
        return (
            <div id="form-steps">
                <div id="form-progression">
                    <div id="form-progression-bar" style={progressionBarStyle()}></div>
                </div>
                <div id="form-steps-container">
                    {(stepSequence.indexOf('Email') !== -1) && <Email properties={stepProps('Email')} />}
                    <Location properties={stepProps('Location')} />
                    <Dates properties={stepProps('Dates')} />
                    <Alert properties={stepProps('Alert')} />
                    {renderSubmitButton()}
                </div>
            </div>)
    }

    return (
        <div id="set-tracker">
            <div id="form" className={`${loading ? 'loading' : ''}`}>
                {displayCanCreateTracker()}
            </div>
        </div>
    )
}