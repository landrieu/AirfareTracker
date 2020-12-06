import React from 'react';
import './Login.scss'

export const Login = (props) => {
    return(
        <div id="login">
            <div id="register-form">
                <div id="register-title">Login</div>
                <div id="register-fields">
                    <div id="register-email">
                        <input type="text" placeholder="email"/>
                    </div>
                    <div id="register-password">
                        <input type="password" placeholder="password"/>
                    </div>
                </div>
                <div id="register-button">
                    <button><div>Submit</div></button>
                </div>
            </div>
            <div id="register-plane">

            </div>
        </div>
    )
}