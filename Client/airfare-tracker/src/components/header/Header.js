import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import { authService } from '../../services/authService';

import './Header.scss'

export const Header = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        authService.subscribe(setIsLoggedIn);
    }, []);

    function onLogoutClick(){
        authService.logout();
        return false;
    }

    return(
        <div id="header">
            <span id="header-title">Airfare Tracker</span>
            <ul id="header-list">
                
                <li className="left"><Link to="/">Dashboard</Link></li>
                <li className="left"><Link to="/set-tracker">Set a tracker</Link></li>
                {isLoggedIn && (<li className="left"><Link to="/my-trackers">My trackers</Link></li>)}
                {!isLoggedIn && (<li className="right"><Link to="/login">Login</Link></li>)}
                {!isLoggedIn && (<li className="right"><Link to="/register">Register</Link></li>)}
                {isLoggedIn && (<li className="right" onClick={onLogoutClick}><Link to='/login'>Logout</Link></li>)}
                
            </ul>
        </div>
    )
}