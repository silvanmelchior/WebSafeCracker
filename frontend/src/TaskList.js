import React from "react";
import "./TaskList.css"


function TaskList(props) {
  if(props.tasks == null) {
    return <div>Loading...</div>;
  }
  else {
    return (
      <div>
        {props.tasks.map(task => (
          <div className={['TaskList-item', props.selected === task.pk ? 'TaskList-item-selected' : ''].join(' ')}
               key={task.pk} onClick={() => props.handleSelect(task.pk)}>
            <div className="TaskList-item-title">{task.nr}: {task.title}</div>
            <div className="TaskList-item-points">Point: {task.points}</div>
            <div className={['TaskList-item-state', 'TaskList-item-state-' + task.state.replace(' ', '-')].join(' ')} />
          </div>
        ))}
      </div>
    )
  }
}

export default TaskList;
