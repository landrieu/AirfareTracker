import React from 'react';
import './Header.scss'

export const Header = (props) => {
    return(
        <div id="header">
            <span>Airfare Tracker</span>
            <ul>
                <li>Dashboard</li>
                <li>Set a tracker</li>
            </ul>
        </div>
    )
}