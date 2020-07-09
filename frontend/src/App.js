import React from "react";
import axios from "axios";
import Login from "./Login";
import SafeCracker from "./SafeCracker";
import "./App.css";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login_status: null,   // null, 'loading', feedback backend (incl. 'ok')
      login_code: ''
    };
  }

  handleLoginCodeChange = (event) => {
    this.setState({login_status: null, login_code: event.target.value})
  };

  handleLoginCodeSubmit = (event) => {
    let demo_mode = process.env.REACT_APP_DEMO_MODE !== undefined;
    if(demo_mode) {
      this.setState({
        login_status: 'ok',
        competitor_name: 'Demo User',
        remaining_time: null
      })
    }
    else {
      this.setState(state => ({login_status: 'loading', login_code: state.login_code}));
      this.login().then(response => {
        if(response.data.status === 'ok') {
          this.updateLoginState(response);
          setInterval(() => {this.login().then(this.updateLoginState)}, 10000);
          setInterval(this.tick, 1000);
        }
        else {
          this.setState({login_status: response.data.status, login_code: ''});
        }
      });
      event.preventDefault();
    }
  };

  login = () => {
    return axios.post('/api/login', {cc: this.state.login_code});
  };

  updateLoginState = (response) => {
    this.setState(state => ({
      login_status: response.data.status,
      login_code: state.login_code,
      competitor_name: response.data.name,
      remaining_time: response.data.remaining_time
    }))
  };

  tick = () => {
    this.setState(state => {
      let time = state.remaining_time - 1;
      if(time <= 0) return {login_status: 'time is up'};
      else return {remaining_time: time};
    })
  };

  render() {
    if(this.state.login_status === 'ok') {
      return (
        <SafeCracker
          cc={this.state.login_code}
          competitor_name={this.state.competitor_name}
          remaining_time={this.state.remaining_time}
        />
      );
    }
    else if(this.state.login_status === 'time is up') {
      return (
        <div className="Login">
          <div className="Login-timeup">Time is up</div>
          <div className="Login-timeup-sub">Thanks for your participation!</div>
        </div>)
    }
    else {
      return (
        <Login
          status={this.state.login_status}
          code={this.state.login_code}
          handleChange={this.handleLoginCodeChange}
          handleSubmit={this.handleLoginCodeSubmit}
        />
      )
    }
  }
}

export default App;
