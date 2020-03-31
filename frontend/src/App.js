import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tasks: []};
  }

  loadTasks = () => {
    axios.get(
      '/api/task',
      {params: {cc: 'asdf'}}
    )
    .then(response => this.loadTaskDone(response.data));
  };

  loadTaskDone = (data) => {
    this.setState({
      tasks: data.tasks
    })
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Edit <code>src/App.js</code> and save to reload.</p>
          {this.state.tasks.map(task => <div key={task.pk}>{task.title}</div>)}
          {this.state.tasks.length === 0 &&
            <button className="App-button" type="button" onClick={this.loadTasks}>Load Tasks</button>}
        </header>
      </div>
    );
  }
}

export default App;

// Examples:
// axios.post('/api/task/1/enter_code', {cc: 'asdf', code: 111}).then(response => console.log(response.data));
// axios.get('/api/task', {params: {cc: 'asdf'}}).then(response => console.log(response.data));
