import React from "react";


class Lock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {code: ''};
  }

  handleChange = (event) => {
    let code = event.target.value;
    if(code === '' || parseInt(code) + '' === code) {
      this.setState({code: code});
    }
  };

  render() {
    return (
      <div>
        Code:
        <input type="text" value={this.state.code}
               onChange={this.handleChange} disabled={this.props.disabled} />
        <input type="button" value="Enter" onClick={() => this.props.handleSubmit(this.state.code)}
               disabled={this.props.disabled || this.state.code === ''} />
      </div>
    )
  }
}

export default Lock;
