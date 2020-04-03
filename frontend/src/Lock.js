import React from "react";


function Lock (props) {
  return (
    <div>
      Code:
      <input type="text" value={props.code}
             onChange={props.handleChange} disabled={props.disabled} />
      <input type="button" value="Enter" onClick={props.handleSubmit}
             disabled={props.disabled || props.code === ''} />
    </div>
  )
}

export default Lock;
