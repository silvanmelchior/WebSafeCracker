import React from "react";


function Task (props) {
  if(props.task_pk == null) {
    return <div>Task auswählen</div>
  }
  else if(props.task_pk === 'loading') {
    return <div>Loading...</div>
  }
  else {
    return (
      <div>
        <div>{props.task.nr}: {props.task.title}</div>
        <div dangerouslySetInnerHTML={{ __html: props.task.description }} />
      </div>
    )
  }
}

export default Task;
