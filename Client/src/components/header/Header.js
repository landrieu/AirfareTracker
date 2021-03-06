import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";

import { authService } from '../../services/authService';
import { DataService } from '../../services/dataService/';

import { useDispatch } from 'react-redux';
import { clearMyTrackers } from '../../redux/MyTrackers/actions';

import './Header.scss'

export const Header = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(authService.loggedIn());

    useEffect(() => {
        authService.subscribe(setIsLoggedIn);
    }, []);

    async function onLogoutClick() {
        authService.logout();
        //Clear redux
        dispatch(clearMyTrackers());
        await DataService.logoutUser();
        return false;
    }

    function isActiveRoute(routeName) {
        return location.pathname === `/${routeName}`;
    }

    function toggleMenu() {
        var x = document.getElementById("header-list");
        x.classList.toggle('active');
    }

    return (
        <div id="header">
            <span id="header-title">Airfare Tracker</span>
            <ul id="header-list">

                <li className={`left ${isActiveRoute('') ? 'active' : ''}`}>
                    <Link to="/">Dashboard</Link>
                </li>
                <li className={`left ${isActiveRoute('set-tracker') ? 'active' : ''}`}>
                    <Link to="/set-tracker">Set a tracker</Link>
                </li>
                <li className={`left ${isActiveRoute('find-tracker') ? 'active' : ''}`}>
                    <Link to="/find-tracker">Find tracker</Link>
                </li>

                {isLoggedIn && (
                    <li className={`left ${isActiveRoute('my-trackers') ? 'active' : ''}`}>
                        <Link to="/my-trackers">My trackers</Link>
                    </li>)}


                {!isLoggedIn && (
                    <li className={`right ${isActiveRoute('login') ? 'active' : ''}`}>
                        <Link to="/login">Login</Link>
                    </li>)}
                {!isLoggedIn && (
                    <li className={`right ${isActiveRoute('register') ? 'active' : ''}`}>
                        <Link to="/register">Register</Link>
                    </li>)}
                {isLoggedIn && (
                    <li className='right' onClick={onLogoutClick}>
                        <Link to='/login'>Logout</Link>
                    </li>)}
            </ul>
            <div id='header-hamburger' onClick={toggleMenu}>
                <img src={process.env.PUBLIC_URL + "/images/hamburger_icon.png"} alt="Hamburger"></img>
            </div>
        </div>
    )
}