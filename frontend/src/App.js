import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


//axios.post('/api/task/1/enter_code', {cc: 'asdf', code: 111}).then(response => console.log(response.data));
axios.get('/api/task', {params: {cc: 'asdf'}}).then(response => console.log(response.data));

function App() {
  return (
    <div className="App">
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
