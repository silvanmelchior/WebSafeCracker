import React from "react";


class Lock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {code: ''};
  }

  handleChange = (event) => {
    let code = event.target.value;
    if(code === '' || parseInt(code) + '' === code) {
      this.props.handleChange(code);
    }
  };

  render() {
    return (
      <div>
        Code:
        <input type="text" value={this.props.code}
               onChange={this.handleChange} disabled={this.props.disabled} />
        <input type="button" value="Enter" onClick={this.props.handleSubmit}
               disabled={this.props.disabled || this.props.code === ''} />
      </div>
    )
  }
}

export default Lock;
