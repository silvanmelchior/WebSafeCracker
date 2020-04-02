import React from "react";


function TaskList(props) {
  if(props.tasks == null) {
    return <div>Loading...</div>;
  }
  else {
    return (
      <div>
        {props.tasks.map(task => (
          <div key={task.pk} onClick={() => props.handleSelect(task.pk)}>
            {task.nr}: {task.title}<br/>
            Point: {task.points}<br/>
            State: {task.state}
          </div>
        ))}
      </div>
    )
  }
}

export default TaskList;
