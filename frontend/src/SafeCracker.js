import React from "react";
import axios from "axios";
import TaskList from "./TaskList";
import "./SafeCracker.css";


class SafeCracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: null,
      tasks: null,
      selected_task_pk: null,   // null if none, 'loading' or pk of selected task
      selected_task: null
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
    this.setState({selected_task_pk: 'loading'});
    axios.get('/api/task/' + task_pk, {params: {cc: this.props.cc}}).then(response => this.setState({
      selected_task_pk: task_pk,
      selected_task: response.data
    }));
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
            <div className="SafeCracker-description">
              {
                this.state.selected_task_pk == null ?
                  'Task auswählen'
                  :
                  this.state.selected_task_pk === 'loading' ?
                    'Loading...'
                    :
                    this.state.selected_task.description
              }
            </div>
            <div className="SafeCracker-code">Code</div>
          </div>
        </div>
      </div>
    )
  }
}

export default SafeCracker;
