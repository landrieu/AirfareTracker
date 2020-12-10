import { useState } from 'react';
import './Email.scss'

export const Email = (props) => {
    const [emailError, setEmailError] = useState('');

    function onSubmit(){
        let {valid, error} = validate();
        if(valid) props.nextStep(1);
        else setEmailError(error);
    }

    function backStep(){
        if(!props.isActive){
            props.nextStep('Email');
        }
    }

    function validate(){
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmailValid = re.test(props.email);
        
        return isEmailValid ? {valid: true} : {valid: false, error: "Email format is incorrect"};
    }

    const activeDisplay = (
        <div>
            <div className="inline-fields">
                <input type="text" placeholder="Email" value={props.email} onChange={e => props.setEmail(e.currentTarget.value)}></input>
                <span>{emailError}</span>
            </div>
            <div id="email-button" className="button" onClick={onSubmit}>
                <button>Submit</button>
            </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            {props.email && <span>Email: {props.email}</span>}
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