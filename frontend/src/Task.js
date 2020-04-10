import React from "react";
import Prism from "prismjs";
import 'prismjs/themes/prism-okaidia.css'


class Task extends React.Component {
  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    Prism.highlightAll();
  }

  render() {
    if(this.props.task_pk == null) {
      return <div>Task auswählen</div>
    }
    else if(this.props.task_pk === 'loading') {
      return <div>Loading...</div>
    }
    else {
      return (
        <div>
          <div>{this.props.task.nr}: {this.props.task.title}</div>
          <div dangerouslySetInnerHTML={{ __html: this.props.task.description }} />
        </div>
      )
    }
  }
}

export default Task;
