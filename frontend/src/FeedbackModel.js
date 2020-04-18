import React from "react";
import "./FeedbackModal.css";


const title = {
  'loading': 'Loading...',
  'solved': 'Correct',
  'second chance': 'Sorry...',
  'blocked': 'Sorry...',
};

const message = {
  'loading': 'Please wait.',
  'solved': 'Congrats! You solved the task!',
  'second chance': 'Wrong code. You have one attempt left.',
  'blocked': 'Wrong code. This task is blocked from now on.',
};

function FeedbackModal (props) {
  return (
    <div className={['FeedbackModal', 'FeedbackModal-state-' + props.status.replace(' ', '-')].join(' ')}>
      <div className="FeedbackModal-title">{title[props.status]}</div>
      <div className="FeedbackModal-message">{message[props.status]}</div>
      {props.status !== 'loading' &&
        <div className="FeedbackModal-button">
          <input type="button" onClick={props.handleClose} value="OK"/>
        </div>
      }
    </div>
  )
}

export default FeedbackModal;
