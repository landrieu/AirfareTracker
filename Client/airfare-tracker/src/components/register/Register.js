import React from 'react';
import './Register.scss'

export const Register = (props) => {
    return(
        <div id="register">
            <div id="register-form">
                <div id="register-title">Register</div>
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