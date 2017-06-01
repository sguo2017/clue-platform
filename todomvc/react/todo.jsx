import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class Todo extends Component {
  constructor(props) {
    super(props);
    console.log("Construct Todo Item", this.props.id, this.props.todo.content);
    this.state = {
      isDone: this.props.todo.isDone,
      isEditing: false
    }
  }
  handleClick = e => {
    this.props.toggle(this.props.todo);
  }
  handleDelete = e => {
    let todo = this.props.todo;
    this.props.delete(todo);
  }
  handleDoubleClick = e => {
    let state = {
      isDone: this.state.isDone,
      isEditing: true
    }
    this.setState(state);
  }
  handleKeyUp = e => {
    if(ENTER_KEY === e.keyCode) {
      let value = e.target.value;
      if(!value) return false;

      e.target.value = "";
      this.props.todo.setContent(value);
      let state = {
        isDone: this.state.isDone,
        isEditing: false
      }
      this.setState(state);
    }
    if(ESCAPE_KEY === e.keyCode) {
      let state = {
        isDone: this.state.isDone,
        isEditing: false
      }
      this.setState(state);
    }
  }
  handleBlur = e => {
    let state = {
      isDone: this.state.isDone,
      isEditing: false
    }
    this.setState(state);
  }
  shouldComponentUpdate(nextProps, nextState) {
    // 优化 render
    let result = false;
    let isSameModel = this.props.todo === nextProps.todo;
    let isSameState = this.state.isDone === nextProps.todo.isDone && this.state.isEditing === nextState.isEditing;
    if(!isSameModel || !isSameState) {
      this.state.isDone = nextProps.todo.isDone;
      result = true;
    }
    return result;
  }
  componentDidUpdate(prevProps, prevState) {
    if(this.state.isEditing) {
      let editInput = ReactDOM.findDOMNode(this.refs.editInput);
      editInput.value = this.props.todo.getContent();
      editInput.focus();
    }
  }
  render() {
    console.log("Render Todo Item", this.props.id, this.props.todo.content);
    let id = this.props.id;
    let todo = this.props.todo;
    let isEditing = this.state.isEditing;

    return (
      <li className={"todo" + (isEditing? " editing": "")}>
        <div className="view">
          <input type="checkbox" onClick={this.handleClick} checked={todo.isDone}></input>
          <label onDoubleClick={this.handleDoubleClick}>
            {todo.getContent()}
          </label>
          <br/>
          <i className="delete" onClick={this.handleDelete}>delete</i>
        </div>
        <input className="edit" ref="editInput" onKeyUp={this.handleKeyUp} onBlur={this.handleBlur}></input>
      </li>
    );
  }
}
Todo.propTypes = {
  id: PropTypes.number.isRequired,
  todo: PropTypes.object.isRequired,
  delete: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired
}

export default Todo;