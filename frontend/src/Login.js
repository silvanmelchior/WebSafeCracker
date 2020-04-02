import React from 'react';


const messages = {
  'invalid code': 'Invalid code, try again',
  'too early': 'Too early, your login window has not opened yet',
  'too late': 'Too late, you missed your login window'
};

function Login(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      {props.status !== 'loading' ?
        <div>
          Code:
          <input type="text" value={props.code} onChange={props.handleChange} />
          <input type="submit" value="Login" />
          <div>{messages[props.status]}</div>
        </div>
        :
        <div>Loading...</div>
      }
    </form>
  )
}

export default Login;
