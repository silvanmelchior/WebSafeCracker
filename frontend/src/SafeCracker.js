import React from "react";
import axios from "axios";
import TaskList from "./TaskList";
import "./SafeCracker.css";


class SafeCracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: null,
      tasks: null
    };
  }

  componentDidMount() {
    this.loadTasks();
  }

  loadTasks = () => {
    axios.get('/api/task', {params: {cc: this.props.cc}}).then(this.loadTasksDone);
  };

  loadTasksDone = (response) => {
    this.setState({
      points: response.data.points,
      tasks: response.data.tasks
    });
  };

  handleTaskSelect = (task_pk) => {
    console.log(task_pk)
  };

  render() {
    return (
      <div className="SafeCracker">
        <div className="SafeCracker-header">
          <div className="SafeCracker-title">Web Safe Cracker</div>
          <div className="SafeCracker-status">
            Name: {this.props.competitor_name}<br/>
            Time: {this.props.remaining_time}<br/>
            Points: {this.state.points}
          </div>
        </div>
        <div className="SafeCracker-body">
          <div className="SafeCracker-tasklist">
            <TaskList
              tasks={this.state.tasks}
              handleSelect={this.handleTaskSelect}
            />
          </div>
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
