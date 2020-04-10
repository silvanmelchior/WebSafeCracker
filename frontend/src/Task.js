import React from "react";
import Prism from "prismjs";
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/themes/prism-okaidia.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import "./Task.css";


class Task extends React.Component {
  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    // Code
    Prism.highlightAll();
    // Image
    [...document.querySelectorAll('[data-imgurl]')].forEach(div => {
      let path = div.dataset.imgurl;
      let img = document.createElement('img');
      img.src = this.props.task.media_url + path;
      div.innerHTML = '';
      div.style.border = '';
      div.className = 'Task-blockimg';
      div.appendChild(img);
    })
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
