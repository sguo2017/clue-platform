import React, { Component } from "react";
import PropTypes from "prop-types";

class Input extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let props = this.props;

    return (
      <input type="text" placeholder={props.placeholder} ref={props.inputRef} onKeyUp={props.handleKeyUp}>
      </input>
    )
  }
}

Input.propTypes = {
  placeholder: PropTypes.string,
  inputRef: PropTypes.func,
  handleKeyUp: PropTypes.func.isRequired
}
Input.defaultProps = {
  placeholder: "请输入"
}

export default Input