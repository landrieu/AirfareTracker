import React, { useState } from 'react';
import './Email.scss';

import { updateForm } from '../../../redux/SetTracker/actions';
import { DataService } from '../../../services/dataService/';

import { useDispatch, useSelector} from 'react-redux';

export const Email = ({properties}) => {
    const [emailError, setEmailError] = useState('');
    const [checkingEmail, setCheckingEmail] = useState(false);
    const email = useSelector(state => state.setTracker.email);
    const dispatch = useDispatch();

    async function onSubmit(){
        let {valid, error} = validate();
        if(!valid) return setEmailError(error);
         
        setCheckingEmail(true);
        let [canCreate, reason] = await checkEmailAddress();
        setCheckingEmail(false);

        if(canCreate) properties.nextStep(1);
        else if(!canCreate && !reason) setEmailError('The limit of tracker creation has been reached');
        else setEmailError(reason);
    }

    function checkEmailAddress(){
        return new Promise(resolve => {
            DataService.canCreateNewTracker(email).then(res => {
                resolve([res.canCreateNewTracker, null]);
            }).catch((e) => {
                resolve([false, e.message]);
            });
        });
    }

    function setEmail(value){
        dispatch(updateForm({email: value}));
    }

    function backStep(){
        if(!properties.isActive){
            properties.nextStep('Email');
        }
    }

    function validate(){
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmailValid = re.test(email);
        
        return isEmailValid ? {valid: true} : {valid: false, error: "Email format is incorrect"};
    }

    function onChange(e){
        setEmail(e.currentTarget.value);
        setEmailError('');
    }

    const activeDisplay = (
        <div>
            <div className="inline-fields">
                <input type="text" placeholder="Email" value={email} onChange={onChange}></input>
            </div>
            <div className="error-message">{emailError}</div>
            <div id="email-button" className="button" onClick={onSubmit}>
                <button className={`${(properties.isLoading || checkingEmail) ? 'loading' : ''}`}>
                    {properties.buttonLabel}
                </button>
            </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            {email && <span><span className="set-tracker-label">Email: </span>{email}</span>}
        </div>
    )

    function selectDisplay(){
        return properties.isActive ? activeDisplay : unactiveDisplay;
    }

    function setClassNames(){
        let classNames = "step";
        if(properties.isActive) classNames += " active";
        if(properties.isVisible) classNames += " visible";
        return classNames;
    }

    return (
        <div id="step-email" className={setClassNames()} style={properties.stepStyle} onClick={backStep}>
            {selectDisplay()}
        </div>
    )
}