import React from 'react';
import "./Login.css"
import logo from './logo.png'


const message = {
  'invalid code': 'Invalid code, try again',
  'too early': 'Too early, your login window has not opened yet',
  'too late': 'Too late, you missed your login window'
};

function Login(props) {
  let demo_mode = process.env.REACT_APP_DEMO_MODE !== undefined;
  return (
    <div className="Login">
      <img className="Login-img" src={logo} alt="logo" />
      <form onSubmit={props.handleSubmit}>
        {props.status !== 'loading' ?
          <div>
            <div className="Login-form">
              Access Code:&nbsp;
              <input
                type={demo_mode ? 'text' : 'password'}
                value={demo_mode ? 'DEMO MODE' : props.code}
                disabled={demo_mode}
                onChange={props.handleChange}
              />
            </div>
            <div className="Login-button">
              <input type="submit" value="Login" />
            </div>
            <div className="Login-message">{message[props.status]}</div>
          </div>
          :
          <div className="Login-loading">Loading...</div>
        }
      </form>
    </div>
  )
}

export default Login;
