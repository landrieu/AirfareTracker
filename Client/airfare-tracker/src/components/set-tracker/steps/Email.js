import React, { useState } from 'react';
import './Email.scss';

import { saveForm, updateForm } from '../../../redux/SetTracker/actions';
import { useDispatch, useSelector} from 'react-redux';

export const Email = (props) => {
    const [emailError, setEmailError] = useState('');
    const email = useSelector(state => state.setTracker.email);
    const dispatch = useDispatch();

    function onSubmit(){
        let {valid, error} = validate();
        if(valid) props.nextStep(1);
        else setEmailError(error);
    }

    function setEmail(value){
        dispatch(updateForm({email: value}));
    }

    function backStep(){
        if(!props.isActive){
            props.nextStep('Email');
        }
    }

    function validate(){
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmailValid = re.test(email);
        
        return isEmailValid ? {valid: true} : {valid: false, error: "Email format is incorrect"};
    }

    const activeDisplay = (
        <div>
            <div className="inline-fields">
                <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.currentTarget.value)}></input>
                <span>{emailError}</span>
            </div>
            <div id="email-button" className="button" onClick={onSubmit}>
                <button className={`${props.isLoading ? 'loading' : ''}`}>
                    {props.buttonLabel}
                </button>
            </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            {email && <span>Email: {email}</span>}
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
        <div id="step-email" className={setClassNames()} style={props.stepStyle} onClick={backStep}>
            {selectDisplay()}
        </div>
    )
}