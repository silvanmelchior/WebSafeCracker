import React from "react";
import "./Header.css";
import logo from './logo.png'


function remaining_time(t) {
  if(t === null) return 'unlimited';
  let mins = Math.ceil(t/60);
  if (mins === 1) return '1 minute';
  else return mins + ' minutes';
}


function Header (props) {
  return (
    <div className="Header">
      <div className="Header-logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="Header-title"><div>Web Safe Cracker</div></div>
      <div className="Header-status">
        <div className="Header-status-name">{props.competitor_name}</div>
        <div className="Header-status-time">Remaining Time: {remaining_time(props.remaining_time)}</div>
        <div className="Header-status-points">Your Points: {props.points}</div>
      </div>
    </div>
  )
}

export default Header;
