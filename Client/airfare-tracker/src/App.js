import logo from './logo.svg';
import React, {useState, useEffect, useCallback} from 'react';
import {DataService} from './services/dataService';
import {Header} from './components/header/Header'

import './App.css';

function App() {
  useEffect(() => {
    // Fetch
    console.log('HELLO');
    //DataService.postIP();
    DataService.getUserWithEmail('lio23@hotmail.fr').then((res) => {
      console.log(res);
    });
  }, [])

  return (
    <div className="App">
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
  );
}

export default App;
