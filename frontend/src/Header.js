import React from "react";
import "./Header.css";


function Header (props) {
  return (
    <div className="Header">
      <div className="Header-title">Web Safe Cracker</div>
      <div className="Header-status">
        Name: {props.competitor_name}<br/>
        Time: {props.remaining_time}<br/>
        Points: {props.points}
      </div>
    </div>
  )
}

export default Header;
