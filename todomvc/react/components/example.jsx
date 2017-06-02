import React, { Component } from "react";
import PropTypes from "prop-types";

class Example extends React.Component {
  // static defaultProps = {
  //   content: "I'm Example"
  // }
  constructor(props) {
    super(props);
    // componentWillMount go here
  }
  render() {
    return (
      <h2>{this.props.content}</h2>
    );
  }
}

Example.propTypes = {
  content: PropTypes.string.isRequired
}

Example.defaultProps = { content: "I'm Example." }

export default Example;