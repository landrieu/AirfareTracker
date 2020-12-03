import logo from './logo.svg';
import React, {useState, useEffect, useCallback} from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";
import {DataService} from './services/dataService';
import {Header} from './components/header/Header';
import {Login} from './components/login/Login';
import {Register} from './components/login/Login';
import {Home} from './components/home/Home';

import './App.css';

export default function App() {
  useEffect(() => {
    // Fetch
    console.log('HELLO');
    //DataService.postIP();
    DataService.getUserWithEmail('lio23@hotmail.fr').then((res) => {
      console.log(res);
    });

    DataService.getFrequentTrackers().then((res) => {
      console.log(res);
    });

    DataService.getUserInfo().then(res => {
      console.log(res);
    })
  }, [])

  return (
    <Router>
    <div>
      <Header />

      <Switch>
        <Route path="/register">
          <Login />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  </Router>
    
  );
}

/**
 * <div className="App">
      <Header />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
 */