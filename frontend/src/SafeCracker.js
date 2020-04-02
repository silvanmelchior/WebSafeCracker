import React from "react";
import axios from "axios";
import "./SafeCracker.css";


class SafeCracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="SafeCracker">
        <div className="SafeCracker-header">
          <div className="SafeCracker-title">Web Safe Cracker</div>
          <div className="SafeCracker-status">
            Name: {this.props.competitor_name}<br/>
            Time: {this.props.remaining_time}
          </div>
        </div>
        <div className="SafeCracker-body">
          <div className="SafeCracker-tasklist">Tasks</div>
          <div className="SafeCracker-task">
            <div className="SafeCracker-description">Description</div>
            <div className="SafeCracker-code">Code</div>
          </div>
        </div>
      </div>
    )
  }
}

export default SafeCracker;
