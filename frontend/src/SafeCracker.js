import React from "react";
import axios from "axios";
import TaskList from "./TaskList";
import Task from "./Task";
import Lock from "./Lock";
import FeedbackModal from "./FeedbackModel";
import Header from "./Header";
import "./SafeCracker.css";


class SafeCracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: null,
      tasks: null,
      selected_task_pk: null,   // null if none, 'loading' or pk of selected task
      selected_task: null,
      code: '',
      code_feedback: null       // null, 'loading', 'solved', 'second chance', 'blocked'
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
    this.setState({selected_task_pk: 'loading', selected_task: null, code: ''});
    axios.get('/api/task/' + task_pk, {params: {cc: this.props.cc}}).then(response => this.setState({
      selected_task_pk: task_pk,
      selected_task: response.data
    }));
  };

  handleCodeChange = (event) => {
    let code = event.target.value;
    if(code === '' || parseInt(code) + '' === code) {
      this.setState({code: code})
    }
  };

  handleCodeSubmit = () => {
    this.setState({code_feedback: 'loading'});
    axios.post('/api/task/' + this.state.selected_task_pk + '/enter_code',
      {cc: this.props.cc, code: this.state.code}).then(this.handleCodeSubmitDone)
  };

  handleCodeSubmitDone = (response) => {
    let task_pk = this.state.selected_task_pk;
    this.setState({
      points: null,
      tasks: null,
      selected_task_pk: null,
      selected_task: null,
      code: '',
      code_feedback: response.data
    });
    this.loadTasks();
    this.handleTaskSelect(task_pk);
  };

  handleFeedbackClose = () => {
    this.setState({code_feedback: null});
  };

  render() {
    return (
      <div className="SafeCracker">
        {this.state.code_feedback != null &&
          <FeedbackModal
            status={this.state.code_feedback}
            handleClose={this.handleFeedbackClose}
          />
        }
        <div className="SafeCracker-header">
          <Header
            competitor_name={this.props.competitor_name}
            remaining_time={this.props.remaining_time}
            points={this.state.points}
          />
        </div>
        <div className="SafeCracker-body">
          <div className="SafeCracker-tasklist">
            <TaskList
              tasks={this.state.tasks}
              handleSelect={this.handleTaskSelect}
              selected={this.state.selected_task_pk}
            />
          </div>
          <div className="SafeCracker-task">
            <div className="SafeCracker-description">
              <Task
                task_pk={this.state.selected_task_pk}
                task={this.state.selected_task}
              />
            </div>
            <div className="SafeCracker-code">
              {
                this.state.selected_task_pk != null && this.state.selected_task_pk !== 'loading' &&
                <Lock
                  state={this.state.selected_task.state}
                  code={this.state.code}
                  handleChange={this.handleCodeChange}
                  handleSubmit={this.handleCodeSubmit}
                  disabled={['blocked', 'solved'].includes(this.state.selected_task.state) ||
                    this.state.code_feedback === 'loading'}
                />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SafeCracker;
