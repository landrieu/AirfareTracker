import React, { useState } from 'react';
import { DataService } from '../../services/dataService';
import './Login.scss';

import { authService } from '../../services/authService';

export const Login = (props) => {
    const [email, setEmail] = useState('lio23@hotmail.fr');
    const [password, setPassword] = useState('toulouse');

    const [emailError, setEmailError] = useState('');

    function validateLogin(){
        //Email validation
        if(email !== '4564'){
            setEmailError('RRRO')
        }
        //Password validation
        //if(data.pass)
    }

    async function onSubmit(e){
        console.log('SUBMIT');
        //Validate  
        validateLogin({})

        try{
            //Send request
            console.log(email, password)
            let auth = await DataService.loginUser({email, password});
            /*console.log(auth);
            console.log(authService);*/
            console.log(`Is logged in ${authService.loggedIn()}`);
            console.log(authService.loadToken());
        }catch (error) {
            //Unexpected error
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
                    <button><div>Submit</div></button>
                </div>
            </div>
            <div id="register-plane">

            </div>
        </div>
    )
}