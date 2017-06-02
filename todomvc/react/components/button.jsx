import React, { Component } from "react";
import PropTypes from "prop-types";

class Button extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let props = this.props;
    return(
      <button type="button" className={"btn btn-" + props.className} onClick={props.handleClick}>
        {props.text}
      </button>
    );
  }
}
Button.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
}
Button.defaultProps = {
  className: "default",
  text: "按钮"
}

export default Button;