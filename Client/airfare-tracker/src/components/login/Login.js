import React, { useState } from 'react';
import { DataService } from '../../services/dataService';
import './Login.scss';

import { authService } from '../../services/authService';

export const Login = (props) => {
    const [email, setEmail] = useState('lio23@hotmail.fr');
    const [password, setPassword] = useState('toulouse');

    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    function validateLogin(){
        let valid = true;
        //Email validation
        if(email == '4564'){
            setEmailError('RRRO');
            valid = false;
        }
        //Password validation
        //if(data.pass)
        return valid;
    }

    async function onSubmit(){
        //Validate the form
        if (!validateLogin()) return;

        try{
            //Send request
            setLoading(true);
            let auth = await DataService.loginUser({email, password});
            setLoading(false);

        }catch (error) {
            //Unexpected error
            setLoading(false);
            console.log(error);
        }
    }

    return(
        <div id="login">
            <div id="register-form">
                <div id="register-title">Login</div>
                <div id="register-fields">
                    <div id="register-email">
                        <input type="text" placeholder="email" onChange={(e) => setEmail(e.currentTarget.value)} value={email}/>
                        {emailError && <span className="error-message">{emailError}</span>}
                    </div>
                    <div id="register-password">
                        <input type="password" placeholder="password" onChange={(e) => setPassword(e.currentTarget.value)} value={password}/>
                    </div>
                </div>
                <div id="register-button" onClick={(e) => onSubmit(e)}>
                    <button className={`${loading ? 'loading' : ''}`}><div>Submit</div></button>
                </div>
            </div>
            <div id="register-plane">

            </div>
        </div>
    )
}