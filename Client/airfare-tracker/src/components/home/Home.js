import React from 'react';
import './Home.scss'

export const Home = (props) => {
    return(
        <div id="home">
            <div>Home</div>
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
                    <button>Submit</button>
                </div>
            </div>
            <div id="register-plane">
                
            </div>
        </div>
    )
}