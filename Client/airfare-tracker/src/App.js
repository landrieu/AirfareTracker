import logo from './logo.svg';
import React, {useState, useEffect, useCallback} from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";
import { DataService } from './services/dataService';
import { Header } from './components/header/Header';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import { SetTracker } from './components/set-tracker/SetTracker';
import { Home } from './components/home/Home';

import './App.css';
import { from } from 'apollo-boost';

export default function App() {
  useEffect(() => {
    // Fetch
    console.log('HELLO');
    //DataService.postIP();
    /*DataService.getUserWithEmail('lio23@hotmail.fr').then((res) => {
      console.log(res);
    });

    DataService.getFrequentTrackers().then((res) => {
      console.log(res);
    });

    DataService.getUserInfo().then(res => {
      console.log(res);
    })*/

    /*DataService.getUserWithEmail("lio23@hotmail.fr").then(res => {
      console.log(res);
    });*/

    /*DataService.getAirfaresByTracker("5fc764073dc2322234c4f5a1").then(res => {
      console.log(res);
    });*/

    /*DataService.getAirfareNumber().then(res => {
      console.log(res.n);
    });*/
  }, [])

  return (
    <Router>
    <div>
      <Header />

      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/set-tracker">
          <SetTracker />
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