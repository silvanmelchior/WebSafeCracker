import React from "react";
import "./Lock.css"


function Lock (props) {
  return (
    <div className="Lock">
      <span className={'Lock-state-' + props.state.replace(' ', '-')}>Code:</span>&nbsp;
      <input type="text" value={props.code}
             onChange={props.handleChange} disabled={props.disabled} />&nbsp;
      <input type="button" value="Enter" onClick={props.handleSubmit}
             disabled={props.disabled || props.code === ''} />
    </div>
  )
}

export default Lock;
