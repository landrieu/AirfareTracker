import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { DataService } from '../../services/dataService';
import './Login.scss';

import { authService } from '../../services/authService';
import { AUTH_ERRORS } from '../../helpers/errors';

export const Login = (props) => {
    const history = useHistory();
    const [email, setEmail] = useState('lio23@hotmail.fr');
    const [password, setPassword] = useState('toulouse');

    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');

    function validateLogin() {
        let errors = [];

        if (!/\S+@\S+\.\S+/.test(email)) errors.push({ target: 'email', message: AUTH_ERRORS.EMAIL_FORMAT_INVALID });

        if (password.length < 6) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_LENGTH_SHORT });
        if (password.length > 20) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_LENGTH_LONG });
        if (!/^[A-Za-z0-9_@./#&+-]*$/.test(password)) errors.push({ target: 'password', message: AUTH_ERRORS.PASSWORD_INVALID_CHAR });

        //Set Errors
        errors.forEach((err) => setError(err));

        return errors.length === 0;
    }

    async function onSubmit(e) {
        e.preventDefault();

        //Validate the form
        if (!validateLogin()) return;

        try {
            //Send request
            setLoading(true);
            let auth = await DataService.loginUser({ email, password });
            setLoading(false);
            //Redirect to 'my trackers'
            if (auth.success) {
                //Update last login 
                DataService.updateLastConnection();
                //Redirect
                history.push("/my-trackers");
                return;
            }
            //Else display errors
            auth.errors.forEach((err) => setError(err));
            //Else display errors

        } catch ({message}) {
            //Unexpected error
            setLoading(false);
            setError({message});
            console.log(message);
        }
    }

    function setValue(target, value) {
        setError();

        switch (target) {
            case 'email':
                setEmail(value);
                setError({ target });
                break;

            case 'password':
                setPassword(value);
                setError({ target });
                break;

            default:
                break;
        }
    }

    function setError({ target, message = '' } = {}) {
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

    return (
        <div id="login">
            <form id="login-form" onSubmit={(e) => onSubmit(e)}>
                <div id="login-title">Login</div>
                <div id="login-fields">
                    <div id="login-email">
                        <input type="text" placeholder="email" onChange={(e) => setValue('email', e.currentTarget.value)} value={email} />
                        <div className="error-message">{emailError}</div>
                    </div>
                    <div id="login-password">
                        <input type="password" placeholder="password" onChange={(e) => setValue('password', e.currentTarget.value)} value={password} />
                        <div className="error-message">{passwordError}</div>
                    </div>
                    <div className="form-error">
                        {formError}
                    </div>
                </div>
                <div id="login-button">
                    <button className={`${loading ? 'loading' : ''}`} type="submit">
                        Submit
                    </button>
                </div>
            </form>
            <div id="login-plane"></div>
        </div>
    )
}