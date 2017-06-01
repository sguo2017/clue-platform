import React, { Component } from "react";
import Input from "./components/input.jsx";
import Button from "./components/button.jsx";

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handleKeyUp = (event) => {
    if(13 === event.keyCode) {
      let value = event.target.value;
      if(!value) return false;

      event.target.value = "";
      this.props.addOne(value);
    }
  }
  handleClick = (event) => {
    let value = this.textInput.value;
    if(value) {
      this.textInput.value = "";
      this.props.addOne(value);
    }
    this.textInput.focus();
  }
  render() {
    let props = this.props;
    return (
      <div className="header">
        <input type="checkbox" checked={props.allDone} onClick={props.toggleAll}></input>
        <Input inputRef={input=>{this.textInput=input}} handleKeyUp={this.handleKeyUp}></Input>
        <Button className="primary" text="Add" handleClick={this.handleClick}></Button>
      </div>
    )
  }
}

export default Header;