import React, { useState } from 'react';
//import { useHistory } from "react-router-dom";
import './Register.scss';

import { DataService } from '../../services/dataService';
import { AUTH_ERRORS} from '../../helpers/errors';

export const Register = (props) => {

    //const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');

    const [userCreated, setUserCreated] = useState(false);

    function validateRegister(){
        let errors = [];
    
        if(!/\S+@\S+\.\S+/.test(email)) errors.push({target: 'email', message: AUTH_ERRORS.EMAIL_FORMAT_INVALID});
    
        if(password.length < 6) errors.push({target: 'password', message: AUTH_ERRORS.PASSWORD_LENGTH_SHORT});
        if(password.length > 20) errors.push({target: 'password', message: AUTH_ERRORS.PASSWORD_LENGTH_LONG});
        if(!/^[A-Za-z0-9_@./#&+-]*$/.test(password)) errors.push({target: 'password', message: AUTH_ERRORS.PASSWORD_INVALID_CHAR});

        //Set Errors
        errors.forEach((err) => setError(err));

        return errors.length === 0;
    }

    async function onSubmit(e){
        e.preventDefault();
        //Validate the form
        if (!validateRegister()) return;
        
        try{
            //Send request
            setLoading(true);
            let registration = await DataService.registerUser({email, password});
            setLoading(false);

            //Redirect to 'my trackers'
            if(registration.success) {
                setUserCreated(true);
                //return history.push("/set-tracker");
                return;
            }
            //Else display errors
            registration.errors.forEach((err) => setError(err));
            
        }catch (error) {
            //Unexpected error
            setLoading(false);
            console.log(error);
        }
    }

    function setValue(target, value){
        setError();

        switch (target) {
            case 'email':
                setEmail(value);
                setError({target});
                break;
            
            case 'password':
                setPassword(value);
                setError({target});
                break;
        
            default:
                break;
        }
    }

    function setError({target, message = ''} = {}){
        switch (target) {
            case 'email':
                setEmailError(message);
                break;
            
            case 'password':
                setPasswordError(message);
                break;
        
            default: 
                setFormError(message);
                break;
        }
    }

    function displayRegister(){
        if(userCreated){
            return (
            <div id="register-success">
                <span>Your account has been created. Check your email box to enable it!</span>
            </div>
            )
        }

        return (
            <form id="register-form" onSubmit={(e) => onSubmit(e)}>
                <div id="register-title">Register</div>
                <div id="register-fields">
                    <div id="register-email">
                        <input type="text" placeholder="email" onChange={(e) => setValue('email', e.currentTarget.value)} value={email}/>
                        <div className="error-message">{emailError}</div>
                    </div>
                    <div id="register-password">
                        <input type="password" placeholder="password" onChange={(e) => setValue('password', e.currentTarget.value)} value={password}/>
                        <div className="error-message">{passwordError}</div>
                    </div>
                    <div className="form-error">
                        {formError}
                    </div>
                </div>
                <div id="register-button">
                    <button className={`${loading ? 'loading' : ''}`} type="submit">
                        Submit
                    </button>
                </div>
            </form>
        )
    }

    return(
        <div id="register">
            {displayRegister()}
            <div id="register-plane"></div>
        </div>
    )
}