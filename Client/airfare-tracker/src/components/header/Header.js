import React from 'react';
import { Link } from "react-router-dom";

import './Header.scss'

export const Header = (props) => {
    return(
        <div id="header">
            <span id="header-title">Airfare Tracker</span>
            <ul id="header-list">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/set-tracker">Set a tracker</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </div>
    )
}