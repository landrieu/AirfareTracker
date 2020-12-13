import React, {useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
//import { DataService } from './services/dataService';
import { Header } from './components/header/Header';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import { SetTracker } from './components/set-tracker/SetTracker';
import { Home } from './components/home/Home';

import { MyTrackers } from './components/my-trackers/MyTrackers';

import { authService } from './services/authService';
 
import './App.css';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(authService.loggedIn());

  useEffect(() => {
    authService.subscribe(setIsLoggedIn);
  }, []);

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      isLoggedIn
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

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
        <PrivateRoute path='/my-trackers' component={MyTrackers} />
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  </Router>
    
  );
}