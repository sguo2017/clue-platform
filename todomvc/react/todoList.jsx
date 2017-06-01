import React, { Component } from "react";
import TodoModel from "./model/todo";
import Header from "./header.jsx";
import Todo from "./todo.jsx";
import Footer from "./footer.jsx";

class TodoList extends Component {
  constructor(props) {
    console.log("Construct Todo List");
    super(props);
    this.state = {
      todos: [],
      filter: "all"
    }
  }
  toggleAll = () => {
    let all = this.state.todos,
      done = this.getSubTodos("done");
    if(done.length!==all.length) {
      this.state.todos = this.state.todos.map(item => {
        item.done();
        return item;
      });
    } else {
      this.state.todos = this.state.todos.map(item => {
        item.unDone();
        return item;
      });
    }
    this.setState(this.state);
  }
  addOne = (content) => {
    let todo = new TodoModel(content);
    this.state.todos.push(todo);
    this.setState(this.state);
  }
  toggleOne = (todo) => {
    this.state.todos = this.state.todos.map(item => {
      if(todo === item) {
        item.toggle();
      }
      return item;
    });
    this.setState(this.state);
  }
  deleteOne = (todo) => {
    this.state.todos = this.state.todos.filter(item => {
      return item !== todo;
    });
    this.setState(this.state);
  }
  getSubTodos(type) {
    let result;
    switch(type) {
      case "unDone":
        result = this.state.todos.filter(item => {
          return !item.isDone;
        });
        break;
      case "done":
        result = this.state.todos.filter(item => {
          return item.isDone;
        });
        break;
      case "all":
      default:
        result = this.state.todos;
    }
    return result;
  }
  setFilter = (type) => {
    switch(type) {
      case "unDone":
        this.state.filter = "unDone";
        break;
      case "done":
        this.state.filter = "done";
        break;
      case "all":
      default:
        this.state.filter = "all";
    }
    this.setState(this.state);
  }
  clearCompleted = () => {
    this.state.todos = this.state.todos.filter(item => {
      return !item.isDone;
    });
    this.setState(this.state);
  }
  render() {
    console.log("Render Todo List");
    let props = {
      allCount: this.state.todos.length,
      doneCount: (this.state.todos.filter((todo) => {
        return todo.isDone;
      })).length,
      filter: this.state.filter,
      subTodos: this.getSubTodos(this.state.filter)
    }
    let allDone = props.allCount > 0 && props.doneCount === props.allCount;

    let list = props.subTodos.map((todo, index) => {
      return <Todo key={index} id={index} todo={todo} toggle={this.toggleOne} delete={this.deleteOne}></Todo>;
    });

    return (
      <div className="main">
        <Header allDone={allDone} toggleAll={this.toggleAll} addOne={this.addOne}></Header>
        <div className="body">
          <ul className="todos">
          {list}
          </ul>
        </div>
        <Footer totalCount={props.allCount} doneCount={props.doneCount}
          filter={props.filter} setFilter={this.setFilter}
          clearCompleted={this.clearCompleted}>
        </Footer>
      </div>
    )
  }
}

export default TodoList;